import {convertMillisecondsIntoSCORM2004Time} from '#lib';
import {ScormApiWrapper} from './scorm-api-wrapper';
import {PositiveInteger} from './scorm-cmi-element.model';

export class ScormSession<T = unknown> {
  private startSessionTime: Date | null = null;
  private isDisposed = false;
  private isCompleted = false;

  /**
   * @param minPassedScore Range 0..1
   */
  constructor(
    private readonly scormWrapper: ScormApiWrapper,
    private isAssessment: boolean,
    private minPassedScore: PositiveInteger,
  ) {}

  /**
   * @returns Current location
   */
  start(): void {
    if (this.hasError()) {
      return;
    }

    this.startSessionTime = new Date();
    this.scormWrapper.initialize();

    const completionStatus = this.scormWrapper.getValue('cmi.completion_status');

    if (completionStatus === 'unknown') {
      this.scormWrapper.setValue('cmi.success_status', 'unknown');
      this.scormWrapper.setValue('cmi.completion_status', 'incomplete');
      this.scormWrapper.commit();
    } else if (completionStatus === 'completed') {
      this.isCompleted = true;
    }
  }

  /**
   * @param score Range 0..1
   */
  finish(score: PositiveInteger): void {
    if (this.hasError()) {
      return;
    }

    this.isCompleted = true;

    const rawScore = Math.round(score * 100);
    this.scormWrapper.setValue('cmi.score.raw', rawScore);
    this.scormWrapper.setValue('cmi.score.min', 0);
    this.scormWrapper.setValue('cmi.score.max', 100);

    const scaledScore = Math.round(score * 100) / 100;
    this.scormWrapper.setValue('cmi.score.scaled', scaledScore);

    if (this.isAssessment) {
      if (score >= this.minPassedScore) {
        this.scormWrapper.setValue('cmi.success_status', 'passed');
      } else {
        this.scormWrapper.setValue('cmi.success_status', 'failed');
      }
    } else {
      this.scormWrapper.setValue('cmi.success_status', 'unknown');
    }

    this.scormWrapper.setValue('cmi.completion_status', 'completed');
    this.scormWrapper.commit();
  }

  dispose(): void {
    if (this.isDisposed || !this.startSessionTime) {
      return;
    }

    this.isDisposed = true;
    const totalMilliseconds = new Date().getTime() - this.startSessionTime.getTime();
    const scormTime = convertMillisecondsIntoSCORM2004Time(totalMilliseconds);

    this.scormWrapper.setValue('cmi.session_time', scormTime);

    if (this.isCompleted) {
      this.scormWrapper.setValue('cmi.exit', '');
      this.scormWrapper.setValue('adl.nav.request', 'exitAll');
    } else {
      this.scormWrapper.setValue('cmi.exit', 'suspend');
      this.scormWrapper.setValue('adl.nav.request', 'suspendAll');
    }

    this.scormWrapper.commit();
    this.scormWrapper.terminate();
  }

  /**
   * @param progress Range 0..1
   */
  setProgress(progress: PositiveInteger): void {
    if (this.hasError()) {
      return;
    }

    const value = Math.round(progress * 100) / 100;
    this.scormWrapper.setValue('cmi.progress_measure', value);
    this.scormWrapper.commit();
  }

  getLocation(): string | null {
    return this.scormWrapper.getValue('cmi.location');
  }

  setLocation(location: string): void {
    this.scormWrapper.setValue('cmi.location', location);
    this.scormWrapper.commit();
  }

  getSuspendData(): T | null {
    const result = this.scormWrapper.getValue('cmi.suspend_data');

    if (!result) {
      return null;
    }

    const object = JSON.parse(result);

    if (object.data == null) {
      return null;
    }

    return object.data;
  }

  setSuspendData(data: T | null): void {
    if (data == null) {
      this.scormWrapper.setValue('cmi.suspend_data', '');

      return;
    }

    const object = {data};
    const json = JSON.stringify(object);
    this.scormWrapper.setValue('cmi.suspend_data', json);
    this.scormWrapper.commit();
  }

  private hasError(): boolean {
    if (this.isDisposed) {
      console.error('Current SCORM session ended. Start a new one.');

      return true;
    }

    if (this.isCompleted) {
      console.error('This course is already completed.');

      return true;
    }

    return false;
  }
}
