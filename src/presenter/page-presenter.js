import { render } from '../framework/render.js';
import SortingView from '../view/sort-view.js';
import FiltersView from '../view/filters-view.js';
import InfoView from '../view/info-view.js';
import NoPointsView from '../view/no-points-view.js';
import FilterModel from '../model/filter-model.js';
import EventPresenter from './event-presenter.js';
import { SORT_TYPE } from '../const.js';
import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';

export default class PagePresenter {
  #filtersContainer = null;
  #eventsContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #allDestinations = destinationsMock;
  #allOffers = offersMock;

  #filtersComponent = null;
  #sortingComponent = null;
  #infoComponent = null;
  #noPointsComponent = null;
  #eventPresenters = new Map();
  #currentSortType = SORT_TYPE.DAY;

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
        if (this.#infoComponent.element && this.#infoComponent.element.parentNode) {
          this.#infoComponent.element.remove();
        }
        this.#infoComponent = null;
      }
      return;
    }

    if (this.#infoComponent) {
      if (this.#infoComponent.element && this.#infoComponent.element.parentNode) {
        this.#infoComponent.element.remove();
      }
      this.#infoComponent = null;
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

    const totalCost = events.reduce((sum, event) => {
      let eventCost = event.basePrice;
      if (event.offers && event.offers.length) {
        event.offers.forEach((offer) => {
          eventCost += offer.price;
        });
      }
      return sum + eventCost;
    }, 0);

    this.#infoComponent = new InfoView(title, startDate, endDate, totalCost);
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const tripControls = tripMain.querySelector('.trip-main__trip-controls');
      if (tripControls) {
        const existingInfo = tripMain.querySelector('.trip-main__trip-info');
        if (existingInfo) {
          existingInfo.remove();
        }
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
      if (this.#filtersComponent.element && this.#filtersComponent.element.parentNode) {
        this.#filtersComponent.element.remove();
      }
      this.#filtersComponent = null;
    }

    this.#filtersComponent = new FiltersView(filters, 'everything');
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #renderSorting() {
    if (this.#sortingComponent) {
      this.#sortingComponent.removeElement();
    }

    this.#sortingComponent = new SortingView({
      selectedSortType: this.#currentSortType,
      onSortTypeChange: (sortType) => this.#handleSortTypeChange(sortType)
    });

    render(this.#sortingComponent, this.#eventsContainer);
  }

  #handleSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    if (this.#sortingComponent) {
      const newSortingComponent = new SortingView({
        selectedSortType: this.#currentSortType,
        onSortTypeChange: (type) => this.#handleSortTypeChange(type)
      });
      this.#sortingComponent.element.replaceWith(newSortingComponent.element);
      this.#sortingComponent = newSortingComponent;
    }

    this.#renderSortedEvents();
  }

  #getSortedEvents(events) {
    const sortedEvents = [...events];

    switch (this.#currentSortType) {
      case SORT_TYPE.DAY:
        return sortedEvents.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      case SORT_TYPE.TIME:
        return sortedEvents.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
      case SORT_TYPE.PRICE:
        return sortedEvents.sort((a, b) => b.basePrice - a.basePrice);
      default:
        return sortedEvents;
    }
  }

  #renderSortedEvents() {
    const events = this.#getSortedEvents(this.#eventsModel.getAllFullEvents());
    this.#clearEvents();

    const eventItems = this.#eventsContainer.querySelectorAll('.trip-events__item');
    eventItems.forEach((item) => item.remove());

    this.#renderEvents(events);
  }

  #renderNoPoints() {
    if (this.#noPointsComponent) {
      this.#noPointsComponent.removeElement();
    }
    this.#noPointsComponent = new NoPointsView();
    render(this.#noPointsComponent, this.#eventsContainer);
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEvents(events) {
    events.forEach((event) => {
      this.#renderEvent(event);
    });
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      container: this.#eventsContainer,
      onDataChange: (updatedEvent, deletedId) => {
        if (deletedId) {
          this.#handleEventDelete(deletedId);
        } else if (updatedEvent) {
          this.#handleEventChange(updatedEvent);
        }
      },
      onModeChange: () => this.#resetAllEventViews(),
      allDestinations: this.#allDestinations
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #resetAllEventViews() {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleEventChange(updatedEvent) {
    this.#eventsModel.updateEvent(updatedEvent);

    const presenter = this.#eventPresenters.get(updatedEvent.id);
    if (presenter) {
      presenter.init(updatedEvent);
    }

    this.#refreshInfoOnly();
    this.#refreshFiltersOnly();
  }

  #handleEventDelete(deletedId) {
    this.#eventsModel.deleteEvent(deletedId);

    const presenter = this.#eventPresenters.get(deletedId);
    if (presenter) {
      presenter.destroy();
      this.#eventPresenters.delete(deletedId);
    }

    const events = this.#eventsModel.getAllFullEvents();
    if (events.length === 0) {
      if (this.#sortingComponent) {
        this.#sortingComponent.removeElement();
        this.#sortingComponent = null;
      }
      this.#renderNoPoints();
      this.#refreshInfoOnly();
      this.#refreshFiltersOnly();
    } else {
      this.#refreshInfoOnly();
      this.#refreshFiltersOnly();
      this.#renderSortedEvents();
    }
  }

  #refreshInfoOnly() {
    const events = this.#eventsModel.getAllFullEvents();

    if (events.length === 0) {
      if (this.#infoComponent) {
        if (this.#infoComponent.element && this.#infoComponent.element.parentNode) {
          this.#infoComponent.element.remove();
        }
        this.#infoComponent = null;
      }
      return;
    }

    if (this.#infoComponent) {
      if (this.#infoComponent.element && this.#infoComponent.element.parentNode) {
        this.#infoComponent.element.remove();
      }
      this.#infoComponent = null;
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

    const totalCost = events.reduce((sum, event) => {
      let eventCost = event.basePrice;
      if (event.offers && event.offers.length) {
        event.offers.forEach((offer) => {
          eventCost += offer.price;
        });
      }
      return sum + eventCost;
    }, 0);

    this.#infoComponent = new InfoView(title, startDate, endDate, totalCost);
    const tripMain = document.querySelector('.trip-main');
    if (tripMain) {
      const tripControls = tripMain.querySelector('.trip-main__trip-controls');
      if (tripControls) {
        const existingInfo = tripMain.querySelector('.trip-main__trip-info');
        if (existingInfo) {
          existingInfo.remove();
        }
        tripMain.insertBefore(this.#infoComponent.element, tripControls);
      } else {
        render(this.#infoComponent, tripMain);
      }
    }
  }

  #refreshFiltersOnly() {
    const events = this.#eventsModel.getAllFullEvents();
    const filters = this.#filterModel.updateFilters(events);

    if (this.#filtersComponent) {
      if (this.#filtersComponent.element && this.#filtersComponent.element.parentNode) {
        this.#filtersComponent.element.remove();
      }
      this.#filtersComponent = null;
    }

    this.#filtersComponent = new FiltersView(filters, 'everything');
    render(this.#filtersComponent, this.#filtersContainer);
  }
}
