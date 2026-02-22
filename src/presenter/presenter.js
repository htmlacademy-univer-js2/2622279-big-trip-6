import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import FormCreateView from '../view/form-create-view.js';
import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view.js';
import {render} from '../render.js';

const POINT_COUNT = 3;

export default class Presenter {
  constructor({filtersContainer, eventsContainer}) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
  }

  init() {
    this.filtersContainer.innerHTML = '';

    const filtersView = new FiltersView();
    render(filtersView, this.filtersContainer);

    this.eventsContainer.innerHTML = '';

    const sortView = new SortView();
    render(sortView, this.eventsContainer);

    const eventsList = document.createElement('ul');
    eventsList.className = 'trip-events__list';
    this.eventsContainer.appendChild(eventsList);

    const formEditView = new FormEditView();
    render(formEditView, eventsList);

    const formCreateView = new FormCreateView();
    render(formCreateView, eventsList);

    for (let i = 0; i < POINT_COUNT; i++) {
      const pointView = new RoutePointView();
      render(pointView, eventsList);
    }
  }
}
