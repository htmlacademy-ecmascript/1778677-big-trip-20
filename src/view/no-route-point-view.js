import AbstractView from '../framework/view/abstract-view.js';

function createNoRoutePointTemplate() {
  return (
    `
    <p class="trip-events__msg">Click New Event to create your first point</p>`
  );
}

export default class NoRoutePointView extends AbstractView {
  get template() {
    return createNoRoutePointTemplate();
  }

}
