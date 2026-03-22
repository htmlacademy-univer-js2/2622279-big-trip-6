import { render } from '../framework/render.js';
import SortingView from '../view/sort-view.js';
import FiltersView from '../view/filters-view.js';
import EventPresenter from './event-presenter.js';

export default class Presenter {
  #filtersContainer = null;
  #eventsContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #filtersComponent = null;
  #sortingComponent = null;
  #eventPresenters = new Map();

  constructor({ filtersContainer, eventsContainer, eventsModel, offersModel, destinationsModel }) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#renderFilters();
    this.#renderSorting();
    this.#renderEvents();
  }

  #renderFilters() {
    this.#filtersComponent = new FiltersView();
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView();
    render(this.#sortingComponent, this.#eventsContainer);
  }

  #renderEvents() {
    const fullEvents = this.#eventsModel.getAllFullEvents();
    const sortedEvents = [...fullEvents].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    sortedEvents.forEach((event) => {
      this.#renderEvent(event);
    });
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter(
      event,
      this.#offersModel,
      this.#destinationsModel
    );

    eventPresenter.init(this.#eventsContainer, (updatedEvent) => {
      this.#handleEventChange(updatedEvent);
    });

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleEventChange(updatedEvent) {
    this.#eventsModel.updateEvent(updatedEvent);

    const presenter = this.#eventPresenters.get(updatedEvent.id);
    if (presenter) {
      presenter.destroy();
      this.#eventPresenters.delete(updatedEvent.id);
      this.#renderEvent(updatedEvent);
    }
  }
}
