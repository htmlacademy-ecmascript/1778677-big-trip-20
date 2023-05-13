import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;


function humanizeDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

function getTimeDiff(timeFrom, timeTo) {
  const timeDiff = dayjs(timeTo).diff(timeFrom);

  let routePointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      routePointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      routePointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      routePointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return routePointDuration;
}

function isRoutePointFuture(routePoint){
  return (dayjs().isBefore(routePoint.dateFrom));
}

function isRoutePointPast(routePoint){
  return (dayjs().isAfter(routePoint.dateTo));
}

function isRoutePointPresent(routePoint){
  return (dayjs().isAfter(routePoint.dateFrom) && dayjs().isBefore(routePoint.dateTo));
}

export {humanizeDate, getTimeDiff, isRoutePointFuture, isRoutePointPast, isRoutePointPresent};
