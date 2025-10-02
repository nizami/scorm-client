import {convertMillisecondsIntoSCORM2004Time} from '#lib';
import {ScormApiWrapper} from './scorm-api-wrapper';
import {PositiveInteger} from './scorm-cmi-element.model';

export class ScormSession {
  private startSessionTime: Date | null = null;
  private isDisposed = false;
  private isCompleted = false;

  /**
   * @param minPassedScore Range 0..1
   */
  constructor(
    private readonly scorm: ScormApiWrapper,
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
    this.scorm.initialize();

    const completionStatus = this.scorm.getValue('cmi.completion_status');

    if (completionStatus === 'unknown') {
      this.scorm.setValue('cmi.success_status', 'unknown');
      this.scorm.setValue('cmi.completion_status', 'incomplete');
    } else if (completionStatus === 'completed') {
      this.isCompleted = true;
    }

    this.scorm.commit();
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
    this.scorm.setValue('cmi.score.raw', rawScore);
    this.scorm.setValue('cmi.score.min', 0);
    this.scorm.setValue('cmi.score.max', 100);

    const scaledScore = Math.round(score * 100) / 100;
    this.scorm.setValue('cmi.score.scaled', scaledScore);

    if (this.isAssessment) {
      if (score >= this.minPassedScore) {
        this.scorm.setValue('cmi.success_status', 'passed');
      } else {
        this.scorm.setValue('cmi.success_status', 'failed');
      }
    } else {
      this.scorm.setValue('cmi.success_status', 'unknown');
    }

    this.scorm.setValue('cmi.completion_status', 'completed');
    this.scorm.commit();
  }

  dispose(): void {
    if (this.isDisposed || !this.startSessionTime) {
      return;
    }

    this.isDisposed = true;
    const totalMilliseconds = new Date().getTime() - this.startSessionTime.getTime();
    const scormTime = convertMillisecondsIntoSCORM2004Time(totalMilliseconds);

    this.scorm.setValue('cmi.session_time', scormTime);

    if (this.isCompleted) {
      this.scorm.setValue('cmi.exit', '');
      this.scorm.setValue('adl.nav.request', 'exitAll');
    } else {
      this.scorm.setValue('cmi.exit', 'suspend');
      this.scorm.setValue('adl.nav.request', 'suspendAll');
    }

    this.scorm.commit();
    this.scorm.terminate();
  }

  /**
   * @param progress Range 0..1
   */
  setProgress(progress: PositiveInteger): void {
    if (this.hasError()) {
      return;
    }

    const value = Math.round(progress * 100) / 100;
    this.scorm.setValue('cmi.progress_measure', value);
    this.scorm.commit();
  }

  getLocation(): string | null {
    return this.scorm.getValue('cmi.location');
  }

  setLocation(location: string): void {
    this.scorm.setValue('cmi.location', location);
    this.scorm.commit();
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
