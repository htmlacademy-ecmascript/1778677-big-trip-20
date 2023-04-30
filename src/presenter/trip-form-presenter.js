import EditFormView from '../view/edit-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import {render} from '../render.js';


export default class TripFormPresenter {
  routePointListComponent = new RoutePointListView();

  constructor({routePointListContainer}) {
    this.routePointListContainer = routePointListContainer;
  }

  init() {
    render(this.routePointListComponent, this.routePointListContainer);
    render(new EditFormView(), this.routePointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.routePointListComponent.getElement());
    }

  }
}
