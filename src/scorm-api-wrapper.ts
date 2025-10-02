import {ScormApiScanner} from './scorm-api-scanner';
import {
  CmiReadKeyToValueMap,
  CmiReadKeyValuePair,
  CmiWriteKeyToValueMap,
  CmiWriteKeyValuePair,
  Scorm2004Api,
} from './scorm-cmi-element.model';

export class ScormApiWrapper {
  private api: Scorm2004Api | null;
  private initialized = false;
  private terminated = false;

  constructor(private readonly scanner: ScormApiScanner) {
    this.api = this.scanner.getScormApi();

    if (this.api == null) {
      console.error('Could not establish a connection with the LMS.\n\nYour results may not be recorded.');
    }
  }

  initialize(): void {
    if (!this.api || this.initialized) {
      return;
    }

    const result = this.api.Initialize('');
    // console.log('Initialized with result: ' + result);

    if (toBoolean(result)) {
      this.initialized = true;

      return;
    }

    this.printLastError(
      'Could not initialize communication with the LMS.\n\nYour results may not be recorded.',
    );
  }

  terminate(): void {
    if (!this.api || !this.initialized || this.terminated) {
      return;
    }

    const result = this.api.Terminate('');
    // console.log('Terminated with result: ' + result);

    if (toBoolean(result)) {
      this.terminated = true;

      return;
    }

    this.printLastError(
      'Could not terminate communication with the LMS.\n\nYour results may not be recorded.',
    );
  }

  getValue<Element extends CmiReadKeyValuePair['element']>(
    element: Element,
  ): CmiReadKeyToValueMap[Element] | null {
    if (!this.api || !this.initialized || this.terminated) {
      return null;
    }

    const result = this.api.GetValue(element);
    // console.log(`GetValue ${element} with result: ${result}`);

    if (result === '') {
      this.printLastError('Could not retrieve a value from the LMS.');
    }

    return result as CmiReadKeyToValueMap[Element];
  }

  setValue<Element extends CmiWriteKeyValuePair['element']>(
    element: Element,
    value: CmiWriteKeyToValueMap[Element],
  ): void {
    if (!this.api || !this.initialized || this.terminated) {
      return;
    }

    const result = this.api.SetValue(element, value);
    // console.log(`SetValue ${element} = ${value} with result: ${result}`);

    if (!toBoolean(result)) {
      this.printLastError('Could not store a value in the LMS.\n\nYour results may not be recorded.');
    }
  }

  commit(): void {
    if (!this.api || !this.initialized || this.terminated) {
      return;
    }

    const result = this.api.Commit('');
    // console.log(`Commit with result: ${result}`);

    if (!toBoolean(result)) {
      this.printLastError('Could not invoke Commit.\n\nYour results may not be recorded.');
    }
  }

  private printLastError(message: string): void {
    if (!this.api) {
      return;
    }

    const errorNumber = this.api.GetLastError();

    if (errorNumber === 0 || errorNumber === '0') {
      return;
    }

    const errorString = this.api.GetErrorString(errorNumber);
    const diagnostic = this.api.GetDiagnostic(errorNumber);

    const errorDescription =
      'Number: ' + errorNumber + '\nDescription: ' + errorString + '\nDiagnostic: ' + diagnostic;

    console.error(message + '\n\n' + errorDescription);
  }
}

function toBoolean(val: any): boolean {
  return val === true || val === 'true' || val === '1' || val === 1;
}
