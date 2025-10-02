import { Scorm2004Api } from './scorm-cmi-element.model';

export class ScormApiScanner {
  private api: Scorm2004Api | null = null;

  getScormApi(): Scorm2004Api | null {
    if (this.api) {
      return this.api;
    }

    if (window.parent != null && window.parent != window) {
      this.api = this.scanForApi(window.parent);
    }

    if (this.api == null && window.opener != null) {
      this.api = this.scanForApi(window.opener);
    }

    return this.api;
  }

  private scanForApi(win: any): Scorm2004Api | null {
    let tries = 0;

    while (win.API_1484_11 == null && win.parent != null && win.parent != win) {
      tries++;

      if (tries > 500) {
        return null;
      }

      win = win.parent;
    }
    return win.API_1484_11;
  }
}
