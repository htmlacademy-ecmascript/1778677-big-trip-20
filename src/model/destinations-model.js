import {mockDestinations} from '../mock/destination.js';


export default class DestinationsModel {
  destinations = mockDestinations;

  getDestinations() {
    return this.destinations;
  }

  getById(routePoint) {
    return this.destinations.find((destination) => destination.id === routePoint.id);
  }

}
