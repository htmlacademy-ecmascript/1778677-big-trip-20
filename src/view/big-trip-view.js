import AbstractView from '../framework/view/abstract-view.js';

function createBigTripTemplate() {
  return '<section class="trip-events"></section>';
}

export default class BigTripView extends AbstractView {
  get template() {
    return createBigTripTemplate();
  }
}
