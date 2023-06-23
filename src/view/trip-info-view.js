import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';
import { getCheckedOffers, getDestination } from '../utils/common.js';
import { FormatPattern } from '../const.js';
import he from 'he';

const ROUTE_POINTS_COUNT_MAX = 3;

const formatDate = (date, isTripInfo) => {
  const pattern = isTripInfo ? FormatPattern.TRIP_INFO_DATE : FormatPattern.DATE;
  return date ? dayjs(date).format(pattern) : '';
};

function createTripInfoTemplate(getDestinations, getDates, getPrice) {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getDestinations()}</h1>

    <p class="trip-info__dates">${getDates()}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getPrice()}</span>
  </p>
</section>`;
}

export default class TripInfoView extends AbstractStatefulView{
  #routePoints = [];
  #destinations = [];
  #offers = [];

  constructor(routePoints, destinations, offers) {
    super();
    this.#routePoints = routePoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#getDestinations, this.#getDates, this.#getPrice);
  }

  #getDestinations = () => {
    if (!this.#routePoints || !this.#routePoints.length) {
      return '';
    }

    const selectedDestinations = this.#destinations
      .filter((destination) => this.#routePoints
        .find((routePoint) => routePoint.destination === destination.id))
      .map((destination) => destination.name);

    if (selectedDestinations.length > ROUTE_POINTS_COUNT_MAX) {
      const firstDestination = getDestination(this.#routePoints[0].destination, this.#destinations).name;
      const lastDestination = getDestination(this.#routePoints.at(-1).destination, this.#destinations).name;

      return [he.encode(firstDestination), he.encode(lastDestination)].join(' &mdash; ... &mdash; ');
    } else {
      return selectedDestinations.join(' &mdash;');
    }
  };

  #getPrice = () => {
    if (!this.#routePoints || !this.#routePoints.length) {
      return '';
    }

    return this.#routePoints.reduce((total, routePoint) => {
      const checkedOffers = getCheckedOffers(routePoint.type, routePoint.offers, this.#offers);
      const offersSum = checkedOffers.reduce((amount, offer) => {
        amount += offer.price;
        return amount;
      }, 0);

      total += routePoint.basePrice + offersSum;
      return total;
    }, 0);
  };

  #getDates = () => {
    if (!this.#routePoints || !this.#routePoints.length) {
      return '';
    }

    const dateFrom = formatDate(this.#routePoints[0].dateFrom, true);
    const dateTo = formatDate(this.#routePoints.at(-1).dateTo, true);

    return [dateFrom, dateTo].join(' - ');
  };

}
