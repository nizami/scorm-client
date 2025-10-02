import {PositiveInteger} from '#lib';

export function convertMillisecondsIntoSCORM2004Time(totalMilliseconds: PositiveInteger): string {
  let scormTime = '';

  const HUNDREDTHS_PER_SECOND = 100;
  const HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
  const HUNDREDTHS_PER_HOUR = HUNDREDTHS_PER_MINUTE * 60;
  const HUNDREDTHS_PER_DAY = HUNDREDTHS_PER_HOUR * 24;
  const HUNDREDTHS_PER_MONTH = HUNDREDTHS_PER_DAY * ((365 * 4 + 1) / 48);
  const HUNDREDTHS_PER_YEAR = HUNDREDTHS_PER_MONTH * 12;

  let hundredthsOfASecond = Math.floor(totalMilliseconds / 10);

  const years = Math.floor(hundredthsOfASecond / HUNDREDTHS_PER_YEAR);
  hundredthsOfASecond -= years * HUNDREDTHS_PER_YEAR;

  const months = Math.floor(hundredthsOfASecond / HUNDREDTHS_PER_MONTH);
  hundredthsOfASecond -= months * HUNDREDTHS_PER_MONTH;

  const days = Math.floor(hundredthsOfASecond / HUNDREDTHS_PER_DAY);
  hundredthsOfASecond -= days * HUNDREDTHS_PER_DAY;

  const hours = Math.floor(hundredthsOfASecond / HUNDREDTHS_PER_HOUR);
  hundredthsOfASecond -= hours * HUNDREDTHS_PER_HOUR;

  const minutes = Math.floor(hundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
  hundredthsOfASecond -= minutes * HUNDREDTHS_PER_MINUTE;

  const seconds = Math.floor(hundredthsOfASecond / HUNDREDTHS_PER_SECOND);
  hundredthsOfASecond -= seconds * HUNDREDTHS_PER_SECOND;

  if (years > 0) {
    scormTime += years + 'Y';
  }
  if (months > 0) {
    scormTime += months + 'M';
  }
  if (days > 0) {
    scormTime += days + 'D';
  }

  if (hundredthsOfASecond + seconds + minutes + hours > 0) {
    scormTime += 'T';

    if (hours > 0) {
      scormTime += hours + 'H';
    }

    if (minutes > 0) {
      scormTime += minutes + 'M';
    }

    if (hundredthsOfASecond + seconds > 0) {
      scormTime += seconds;

      if (hundredthsOfASecond > 0) {
        scormTime += '.' + hundredthsOfASecond;
      }

      scormTime += 'S';
    }
  }

  if (scormTime == '') {
    scormTime = '0S';
  }

  scormTime = 'P' + scormTime;

  return scormTime;
}
