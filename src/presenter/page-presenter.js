import { render, remove } from '../framework/render.js';
import SortingView from '../view/sort-view.js';
import FiltersView from '../view/filters-view.js';
import InfoView from '../view/info-view.js';
import NoPointsView from '../view/no-points-view.js';
import FilterModel from '../model/filter-model.js';
import EventPresenter from './event-presenter.js';

export default class PagePresenter {
  #filtersContainer = null;
  #eventsContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #filtersComponent = null;
  #sortingComponent = null;
  #infoComponent = null;
  #noPointsComponent = null;
  #eventPresenters = new Map();

  constructor({ filtersContainer, eventsContainer, eventsModel }) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = new FilterModel();
  }

  init() {
    this.#renderInfo();
    this.#renderFilters();

    const events = this.#eventsModel.getAllFullEvents();

    if (events.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSorting();
    this.#renderEvents(events);
  }

  #renderInfo() {
    const events = this.#eventsModel.getAllFullEvents();

    if (events.length === 0) {
      if (this.#infoComponent) {
        remove(this.#infoComponent);
        this.#infoComponent = null;
      }
      return;
    }

    if (this.#infoComponent) {
      remove(this.#infoComponent);
    }

    const sortedEvents = [...events].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];

    const firstDestination = firstEvent.destination?.name || '';
    const lastDestination = lastEvent.destination?.name || '';

    const title = `${firstDestination} &mdash; ${lastDestination}`;

    const startDate = new Date(firstEvent.dateFrom);
    const endDate = new Date(lastEvent.dateTo);

    const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const dateString = `${formatDate(startDate)}&nbsp;&mdash;&nbsp;${formatDate(endDate)}`;

    const totalCost = events.reduce((sum, event) => {
      let eventCost = event.basePrice;
      if (event.offers && event.offers.length) {
        event.offers.forEach((offer) => {
          eventCost += offer.price;
        });
      }
      return sum + eventCost;
    }, 0);

    this.#infoComponent = new InfoView(title, dateString, totalCost);
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const tripControls = tripMain.querySelector('.trip-main__trip-controls');
      if (tripControls) {
        tripMain.insertBefore(this.#infoComponent.element, tripControls);
      } else {
        render(this.#infoComponent, tripMain);
      }
    }
  }

  #renderFilters() {
    const events = this.#eventsModel.getAllFullEvents();
    const filters = this.#filterModel.updateFilters(events);

    if (this.#filtersComponent) {
      remove(this.#filtersComponent);
    }

    this.#filtersComponent = new FiltersView(filters, 'everything');
    render(this.#filtersComponent, this.#filtersContainer);

    const filterInputs = this.#filtersComponent.element.querySelectorAll('.trip-filters__filter-input');
    filterInputs.forEach((input) => {
      input.addEventListener('change', () => {});
    });
  }

  #renderSorting() {
    if (this.#sortingComponent) {
      remove(this.#sortingComponent);
    }
    this.#sortingComponent = new SortingView('day');
    render(this.#sortingComponent, this.#eventsContainer);
  }

  #renderNoPoints() {
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
    this.#noPointsComponent = new NoPointsView();
    render(this.#noPointsComponent, this.#eventsContainer);
  }

  #renderEvents(events) {
    const sortedEvents = [...events].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    sortedEvents.forEach((event) => {
      this.#renderEvent(event);
    });
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      event: event,
      onDataChange: (updatedEvent, deletedId) => {
        if (deletedId) {
          this.#handleEventDelete(deletedId);
        } else if (updatedEvent) {
          this.#handleEventChange(updatedEvent);
        }
      },
      onModeChange: () => this.#resetAllEventViews()
    });

    eventPresenter.init(this.#eventsContainer);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #resetAllEventViews() {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleEventChange(updatedEvent) {
    this.#eventsModel.updateEvent(updatedEvent);

    const presenter = this.#eventPresenters.get(updatedEvent.id);
    if (presenter) {
      presenter.updateElement(updatedEvent);
    }

    this.#refreshInfoAndFilters();
  }

  #handleEventDelete(deletedId) {
    this.#eventsModel.deleteEvent(deletedId);

    const presenter = this.#eventPresenters.get(deletedId);
    if (presenter) {
      presenter.destroy();
      this.#eventPresenters.delete(deletedId);
    }

    this.#refreshInfoAndFilters();

    const events = this.#eventsModel.getAllFullEvents();
    if (events.length === 0) {
      if (this.#sortingComponent) {
        remove(this.#sortingComponent);
        this.#sortingComponent = null;
      }
      this.#renderNoPoints();
    }
  }

  #refreshInfoAndFilters() {
    this.#renderInfo();

    const events = this.#eventsModel.getAllFullEvents();
    const filters = this.#filterModel.updateFilters(events);

    if (this.#filtersComponent) {
      remove(this.#filtersComponent);
    }

    this.#filtersComponent = new FiltersView(filters, 'everything');
    render(this.#filtersComponent, this.#filtersContainer);

    const filterInputs = this.#filtersComponent.element.querySelectorAll('.trip-filters__filter-input');
    filterInputs.forEach((input) => {
      input.addEventListener('change', () => {});
    });
  }
}
