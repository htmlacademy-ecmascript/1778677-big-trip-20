import AbstractView from '../framework/view/abstract-view.js';

function createNoAvailibleServerMessageTemplate() {
  return (
    '<p class="trip-events__msg">Server is not availible</p>'
  );
}

export default class ServerNotAvailibleView extends AbstractView {
  get template() {
    return createNoAvailibleServerMessageTemplate();
  }
}
