import {convertMillisecondsIntoSCORM2004Time} from '#lib';
import {ScormApiWrapper} from './scorm-api-wrapper';
import {PositiveInteger} from './scorm-cmi-element.model';

export enum ScormSessionStatus {
  None = 'None',
  Initialized = 'Initialized',
  Started = 'Started',
  Finished = 'Finished',
  Terminated = 'Terminated',
}

export class ScormSession<T = unknown> {
  private startSessionTime: Date | null = null;
  private isInitialized = false;
  private status = ScormSessionStatus.None;

  /**
   * @param minPassingScore Range 0..1
   */
  constructor(
    private readonly scormWrapper: ScormApiWrapper,
    private isAssessment: boolean,
    private minPassingScore: PositiveInteger,
  ) {}

  initialize(): void {
    if (this.status !== ScormSessionStatus.None) {
      return;
    }

    this.isInitialized = true;
    this.status = ScormSessionStatus.Initialized;

    this.scormWrapper.initialize();
    const completionStatus = this.scormWrapper.getValue('cmi.completion_status');

    if (completionStatus === 'unknown') {
      this.scormWrapper.setValue('cmi.success_status', 'unknown');
      this.scormWrapper.setValue('cmi.completion_status', 'not attempted');
      this.scormWrapper.commit();
    }
  }

  start(): void {
    if (this.status !== ScormSessionStatus.Initialized) {
      return;
    }

    this.status = ScormSessionStatus.Started;
    this.startSessionTime = new Date();

    const completionStatus = this.scormWrapper.getValue('cmi.completion_status');

    if (completionStatus === 'not attempted') {
      this.scormWrapper.setValue('cmi.completion_status', 'incomplete');
      this.scormWrapper.commit();
    }
  }

  /**
   * @param score Range 0..1
   */
  finish(score: PositiveInteger): void {
    if (this.status !== ScormSessionStatus.Started) {
      return;
    }

    this.status = ScormSessionStatus.Finished;

    const rawScore = Math.floor(score * 100);
    this.scormWrapper.setValue('cmi.score.raw', rawScore);
    this.scormWrapper.setValue('cmi.score.min', 0);
    this.scormWrapper.setValue('cmi.score.max', 100);

    const scaledScore = Math.floor(score * 100) / 100;
    this.scormWrapper.setValue('cmi.score.scaled', scaledScore);

    if (this.isAssessment) {
      if (score >= this.minPassingScore) {
        this.scormWrapper.setValue('cmi.success_status', 'passed');
      } else {
        this.scormWrapper.setValue('cmi.success_status', 'failed');
      }
    }

    this.scormWrapper.setValue('cmi.completion_status', 'completed');
    this.scormWrapper.commit();
  }

  isCompleted(): boolean {
    return this.scormWrapper.getValue('cmi.completion_status') === 'completed';
  }

  terminate(): void {
    if (!this.isInitialized) {
      return;
    }

    this.status = ScormSessionStatus.Terminated;

    if (this.startSessionTime) {
      const totalMilliseconds = new Date().getTime() - this.startSessionTime.getTime();
      const scormTime = convertMillisecondsIntoSCORM2004Time(totalMilliseconds);
      this.scormWrapper.setValue('cmi.session_time', scormTime);
    }

    if (this.isCompleted()) {
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
    if (!this.startSessionTime) {
      return;
    }

    const value = Math.floor(progress * 100) / 100;
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
}
