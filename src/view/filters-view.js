import AbstractView from '../framework/view/abstract-view.js';

function createFiltersTemplate({ filters, selectedFilter }) {
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

const FILTERS = [
  { id: 'everything', name: 'Everything' },
  { id: 'future', name: 'Future' },
  { id: 'present', name: 'Present' },
  { id: 'past', name: 'Past' },
];

export default class FiltersView extends AbstractView {
  #selectedFilter = null;

  constructor(selectedFilter) {
    super();
    this.#selectedFilter = selectedFilter;
  }

  get template() {
    return createFiltersTemplate({ filters: FILTERS, selectedFilter: this.#selectedFilter });
  }
}
