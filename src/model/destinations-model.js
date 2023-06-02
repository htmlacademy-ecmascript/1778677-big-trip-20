import {mockDestinations} from '../mock/destination.js';


export default class DestinationsModel {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }

  getById(routePoint) {
    return this.#destinations.find((destination) => destination.id === routePoint.destination);
  }

  getByName(name) {
    return this.#destinations.find((item) => item.name === name);
  }

  getCityNames(){
    return this.#destinations.map((item) => item.name);
  }

}
