import dayjs from 'dayjs';

import * as PLOT from '../meta/plotMeta';

export const getTimeInterval = (startTime: number, endTime: number) => {
  const timeDiff = endTime - startTime;
  let interval: number = 60000;
  let format: string = PLOT.FULL_TIME;

  if (timeDiff <= PLOT.MIN_IN_MILLIS) {
    // 1분까지는 5초 간격
    interval = PLOT.FIVE_SEC_IN_MILLIS;
    format = PLOT.MINUTE_SECOND;
  } else if (timeDiff <= PLOT.THREE_MIN_IN_MILLIS) {
    // 3분 까지는 30초 간격
    interval = PLOT.THIRTY_SEC_IN_MILLIS;
    format = PLOT.MINUTE_SECOND;
  } else if (timeDiff <= PLOT.THIRTY_MIN_IN_MILLIS) {
    //30분 까지는 1분 간격
    interval = PLOT.MIN_IN_MILLIS;
    format = PLOT.HOUR_MINUTE;
  } else if (timeDiff <= PLOT.TWO_HOUR_IN_MILLIS) {
    // 2시간 까지는 5분 간격
    interval = PLOT.FIVE_MIN_IN_MILLIS;
    format = PLOT.HOUR_MINUTE;
  } else if (timeDiff <= PLOT.SIX_HOUR_IN_MILLIS) {
    // 6시간 까지는 30분 간격
    interval = PLOT.THIRTY_MIN_IN_MILLIS;
    format = PLOT.HOUR_MINUTE;
  } else if (timeDiff <= PLOT.THREE_DAY_IN_MILLIS) {
    // 3일 전까지는 시간 간격
    interval = PLOT.HOUR_IN_MILLIS;
    format = PLOT.HOUR_MINUTE;
  } else if (timeDiff < PLOT.THREE_YEAR_IN_MILLIS) {
    // 3년 전까지는 일 간격
    interval = PLOT.DAY_IN_MILLIS;
    format = PLOT.MONTH_DATE;
  } else {
    interval = PLOT.MONTH_IN_MILLIS;
    format = PLOT.MONTH_DATE;
  }

  return {
    interval,
    format,
  };
};

export const getDayInterval = (startTime: number, endTime: number) => {
  const timeDiff = endTime - startTime;
  let interval = PLOT.DAY_IN_MILLIS;
  let format = PLOT.MONTH_DATE;
  let status = true;
  const date = new Date(startTime);
  date.setHours(0, 0, 0, 0);
  let sTime = date.getTime() + PLOT.DAY_IN_MILLIS;

  if (timeDiff >= PLOT.THREE_YEAR_IN_MILLIS) {
    interval = PLOT.YEAR_IN_MILLIS;
    format = PLOT.YEAR;
    sTime = date.setMonth(0, 1) + PLOT.YEAR_IN_MILLIS;
  } else if (timeDiff >= PLOT.THREE_MONTH_IN_MILLIS) {
    //3달 이상의 경우 달 단위로 표시
    interval = PLOT.MONTH_IN_MILLIS;
    format = PLOT.YEAR_MONTH;
    sTime = date.setDate(1) + PLOT.MONTH_IN_MILLIS;
  } else if (timeDiff >= PLOT.THREE_WEEK_IN_MILLIS) {
    // 3주 이상인 경우 주 단위로 표시
    interval = PLOT.SEVEN_DAY_IN_MILLIS;
    const day = date.getDay();
    if (day) {
      sTime += (7 - day) * PLOT.DAY_IN_MILLIS;
    }
  } else {
    status = false;
  }

  return { status, interval, format, sTime };
};

export const getFormatFunction = (formatText = PLOT.FULL_TIME) => {
  return (time: number) => {
    return dayjs(time).format(formatText);
  };
};
