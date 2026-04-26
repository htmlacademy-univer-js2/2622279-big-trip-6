import AbstractView from '../framework/view/abstract-view.js';

function createFiltersTemplate(filters, selectedFilter) {
  const filtersTemplate = filters.map(({ id, name, disabled = false }) => `
    <div class="trip-filters__filter">
      <input
        id="filter-${id}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${id}"
        ${selectedFilter === id ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${id}">${name}</label>
    </div>
  `).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #selectedFilter = null;

  constructor(filters, selectedFilter) {
    super();
    this.#filters = filters;
    this.#selectedFilter = selectedFilter;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#selectedFilter);
  }
}
