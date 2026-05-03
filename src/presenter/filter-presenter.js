import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { FilterType, UpdateType } from '../const.js';
import { isPointFuture, isPointPresent, isPointPast } from '../utils.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #eventsModel = null;
  #filterComponent = null;

  constructor({ container, filterModel, eventsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#filterModel.addObserver(this.#handleModelChange.bind(this));
    this.#eventsModel.addObserver(this.#handleEventsChange.bind(this));
  }

  init() {
    this.#renderFilters();
  }

  #handleEventsChange(updateType) {
    if (updateType === UpdateType.INIT || updateType === UpdateType.MAJOR || updateType === UpdateType.MINOR) {
      this.#renderFilters();
    }
  }

  #handleModelChange() {
    this.#renderFilters();
  }

  #getFilters() {
    const events = this.#eventsModel.getAllFullEvents();

    const filters = [
      { id: FilterType.EVERYTHING, name: 'Everything', disabled: false },
      { id: FilterType.FUTURE, name: 'Future', disabled: !events.some((event) => isPointFuture(event)) },
      { id: FilterType.PRESENT, name: 'Present', disabled: !events.some((event) => isPointPresent(event)) },
      { id: FilterType.PAST, name: 'Past', disabled: !events.some((event) => isPointPast(event)) },
    ];

    return filters;
  }

  #renderFilters() {
    const filters = this.#getFilters();
    const currentFilter = this.#filterModel.getFilter();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, currentFilter);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    }

    this.#addFilterListeners();
  }

  #addFilterListeners() {
    const filterInputs = this.#filterComponent.element.querySelectorAll('.trip-filters__filter-input');

    filterInputs.forEach((input) => {
      input.removeEventListener('change', this.#filterChangeHandler);
      input.addEventListener('change', this.#filterChangeHandler);
    });
  }

  #filterChangeHandler = (evt) => {
    const newFilter = evt.target.value;
    if (!evt.target.disabled) {
      this.#filterModel.setFilter(UpdateType.MAJOR, newFilter);
    }
  };
}
