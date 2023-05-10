import {mockRoutePoints} from '../mock/route-point.js';

export default class RoutePointsModel {
  #routePoits = mockRoutePoints;

  get routePoints() {
    return this.#routePoits;
  }

}
