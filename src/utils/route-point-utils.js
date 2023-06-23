import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;


const humanizeDate = (date, dateFormat) => date ? dayjs(date).format(dateFormat) : '';

const getTimeDiff = (timeFrom, timeTo) => {
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
};

const getDatesDiff = (dateFrom, dateTo, timeUnit) => timeUnit ? dayjs(dateTo).diff(dayjs(dateFrom), timeUnit) : dayjs(dateTo).diff(dayjs(dateFrom));

const isRoutePointFuture = (routePoint) => dayjs().isBefore(routePoint.dateFrom);

const isRoutePointPast = (routePoint) => dayjs().isAfter(routePoint.dateTo);

const isRoutePointPresent = (routePoint) => dayjs().isAfter(routePoint.dateFrom) && dayjs().isBefore(routePoint.dateTo);

const sortByDay = (routePointA, routePointB) => {
  const dateA = dayjs(routePointA.dateFrom);
  const dateB = dayjs(routePointB.dateFrom);
  if (dateA.isSame(dateB, 'D')) {
    return 0;
  }
  return dateA.isAfter(dateB, 'D') ? 1 : -1;
};

const sortByDurationTime = (routePointA, routePointB) => getDatesDiff(routePointB.dateFrom, routePointB.dateTo) - getDatesDiff(routePointA.dateFrom, routePointA.dateTo);

const sortByPrice = (routePointA, routePointB) => routePointB.basePrice - routePointA.basePrice;

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');


export {humanizeDate, getTimeDiff, isRoutePointFuture, isRoutePointPast, isRoutePointPresent, sortByDay, sortByDurationTime, sortByPrice, isDatesEqual};
