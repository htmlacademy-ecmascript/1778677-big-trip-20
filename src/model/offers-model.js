import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';
export default class OffersModel extends Observable{
  #offers = [];
  #offersApiService = null;

  constructor({offersApiService}) {
    super();
    this.#offersApiService = offersApiService;

  }

  get offers() {
    return this.#offers;
  }

  getByType(routePoint) {
    return this.#offers.find((offer) => offer.type === routePoint.type).offers;
  }

  getById(routePoint){
    return this.getByType(routePoint).filter((offer) => routePoint.offers.includes(offer.id));
  }

  getTypes(){
    return this.#offers.map((item) => item.type);
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch(err) {
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

}
