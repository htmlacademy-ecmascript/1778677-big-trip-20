import {mockRoutePoints} from '../mock/route-point.js';

export default class RoutePointsModel {
  routePoits = mockRoutePoints;

  getRoutePoints() {
    return this.routePoits;
  }

}
