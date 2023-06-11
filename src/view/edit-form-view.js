import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EMPTY_ROUTEPOINT } from '../const.js';
import {humanizeDate} from '../utils/route-point-utils.js';
import {capitalize} from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DATE_FORMAT_IN_FORM = 'DD/MM/YY HH:mm';

function createEditFormTemplate(routePoint, destination, offers, cityNames, offersTypes) {
  const {dateFrom, dateTo, type, basePrice} = routePoint;

  const startTimeInForm = humanizeDate(dateFrom, DATE_FORMAT_IN_FORM);
  const endTimeInForm = humanizeDate(dateTo, DATE_FORMAT_IN_FORM);

  function createEventTypeTemplate(types) {
    return types.map((typeItem) =>
      `<div class="event__type-item">
       <input id="event-type-${typeItem.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem.toLowerCase()}">
       <label class="event__type-label  event__type-label--${typeItem.toLowerCase()}" for="event-type-${typeItem.toLowerCase()}-1">${capitalize(typeItem)}</label>
      </div>`).join('');
  }

  function createCityListTemplate(cities) {
    return cities.map((city) => `<option value="${city}"></option>`).join('');
  }

  function createPictureTemplate(pictures) {
    return pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="Event photo">`).join('');
  }

  function createOfferTemplate(offersList) {
    return offersList.map((offer) =>
      `<div class="event__offer-selector">
         <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${offer.id}" type="checkbox" value="${offer.id}" name="event-offer-${type}" ${routePoint.offers.includes(offer.id) ? 'checked' : ''}>
         <label class="event__offer-label" for="event-offer-${type}-${offer.id}">
           <span class="event__offer-title">${offer.title}</span>
           &plus;&euro;&nbsp;
           <span class="event__offer-price">${offer.price}</span>
         </label>
       </div>`).join('');
  }

  return `<li class="trip-events__item"><form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createEventTypeTemplate(offersTypes)}

        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${capitalize(type)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" autocomplete="off"  type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1"/>
      <datalist id="destination-list-1">
      ${createCityListTemplate(cityNames)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeInForm}">
      —
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeInForm}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        €
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(`${basePrice}`)}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${offers ? createOfferTemplate(offers) : ''}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination ? he.encode(destination.description) : ''}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${destination ? createPictureTemplate(destination.pictures) : ''}
        </div>
      </div>
    </section>
  </section>
</form>
<li>`;
}

export default class EditFormView extends AbstractStatefulView {
  #destinationsModel = null;
  #offersModel = null;
  #handleSubmit = null;
  #handleDeleteClick = null;
  #handleFavoriteClick = null;
  #datepicker = null;

  constructor({destinationsModel, routePoint = EMPTY_ROUTEPOINT, offersModel, onFormSubmit, onDeleteClick}) {
    super();
    this.#destinationsModel = destinationsModel;
    this._setState(EditFormView.parseRoutePointToState(routePoint));
    this.#offersModel = offersModel;
    this.#handleSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinationsModel.getById(this._state), this.#offersModel.getByType(this._state), this.#destinationsModel.getCityNames(), this.#offersModel.getTypes());
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(routePoint) {
    this.updateElement(
      EditFormView.parseRoutePointToState(routePoint),
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickers = () =>{
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        'time_24hr': true,
      }
    );

    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        'time_24hr': true,
      },
    );
  };

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerSelectHandler);
    this.element.querySelector('.event__field-group--price').addEventListener('change', this.#basePriceChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepickers();
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: this.#offersModel ? this.#offersModel.offers : '',
    });
  };

  #destinationChangeHandler = (evt) => {
    this.updateElement({
      destination: this.#destinationsModel.getByName(evt.target.value) ? this.#destinationsModel.getByName(evt.target.value).id : '',
    });
  };

  #basePriceChangeHandler = (evt) => {
    this.updateElement({
      basePrice: evt.target.value,
    });
  };

  #offerSelectHandler = (evt) => {
    const selectedOffer = evt.target.value;
    if (evt.target.checked) {
      this.updateElement({
        offers: [...this._state.offers, selectedOffer],
      });
    } else {
      this.updateElement({
        offers: [...this._state.offers.filter((offer) => offer !== selectedOffer)],
      });
    }
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(EditFormView.parseStateToRoutePoint(this._state), this.#destinationsModel.getById(this._state), this.#offersModel.getByType(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToRoutePoint(this._state));
  };

  static parseRoutePointToState(state) {
    return {...state};
  }

  static parseStateToRoutePoint(routePoint) {
    return {...routePoint};
  }
}

