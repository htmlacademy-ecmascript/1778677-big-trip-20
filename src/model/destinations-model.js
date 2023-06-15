import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';
export default class DestinationsModel extends Observable{
  #destinations = [];
  #destinationsApiService = null;

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

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

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
  }

}
