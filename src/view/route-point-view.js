import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate, getTimeDiff} from '../utils/route-point-utils.js';

const DATE_FORMAT = 'YYYY-MM-DD';
const EVENT_DATE = 'MMM DD';
const TIME_FORMAT = 'HH:mm';


function createRoutePointTemplate(routePoint, destination, offers) {
  const {dateFrom, dateTo, type, basePrice, isFavorite} = routePoint;


  const dateFormat = humanizeDate(dateFrom, DATE_FORMAT);
  const eventDate = humanizeDate(dateFrom, EVENT_DATE);
  const startTime = humanizeDate(dateFrom, TIME_FORMAT);
  const endTime = humanizeDate(dateTo, TIME_FORMAT);
  const durationTime = getTimeDiff(dateFrom, dateTo);

  function createOfferTemplate(offersList) {
    return offersList.map((offer) =>
      `<li class="event__offer">
         <span class="event__offer-title">${offer.title}</span>
         &plus;&euro;&nbsp;
         <span class="event__offer-price">${offer.price}</span>
       </li>`).join('');
  }

  const getFavoriteButton = () => isFavorite ? 'active' : '';

  return `<li class="trip-events__item">
  <div class="event">
  <time class="event__date" datetime="${dateFormat}">${eventDate}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFormat}T${startTime}">${startTime}</time>
        —
        <time class="event__end-time" datetime="${dateFormat}T${endTime}">${endTime}</time>
      </p>
      <p class="event__duration">${durationTime}</p>
    </div>
    <p class="event__price">
      €&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${createOfferTemplate(offers)}
    </ul>
    <button class="event__favorite-btn event__favorite-btn--${getFavoriteButton()}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}

export default class RoutePointView extends AbstractView {
  #destination = null;
  #routePoint = null;
  #offers = null;
  #handleClick = null;

  constructor({routePoint, destination, offers, onClick}){
    super();
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleClick = onClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createRoutePointTemplate(this.#routePoint, this.#destination, this.#offers);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

}

