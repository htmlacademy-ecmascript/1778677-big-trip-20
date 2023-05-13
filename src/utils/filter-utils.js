import {FilterType} from '../const.js';
import {isRoutePointFuture, isRoutePointPast, isRoutePointPresent} from './route-point-utils.js';

const filter = {
  [FilterType.EVERYTHING]: (routePoints) => [...routePoints],
  [FilterType.FUTURE]: (routePoints) => routePoints.filter((routePoint) => isRoutePointFuture(routePoint)),
  [FilterType.PAST]: (routePoints) => routePoints.filter((routePoint) => isRoutePointPast(routePoint)),
  [FilterType.PRESENT]: (routePoints) => routePoints.filter((routePoint) => isRoutePointPresent(routePoint)),

};

export {filter};
