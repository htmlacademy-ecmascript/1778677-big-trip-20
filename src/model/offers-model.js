import {mockOffers} from '../mock/offer.js';

export default class OffersModel {
  offers = mockOffers;

  getOffers() {
    return this.offers;
  }

  getByType(routePoint) {
    return this.offers.find((offer) => offer.type === routePoint.type).offers;
  }

  getById(routePoint){
    return this.getByType(routePoint).filter((offer) => routePoint.offers.includes(offer.id));
  }

}
