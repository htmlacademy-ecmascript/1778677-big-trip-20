import {createElement} from '../render.js';

function createRoitePointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class RoutePointListView {
  getTemplate() {
    return createRoitePointListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
