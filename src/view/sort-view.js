import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate({ sortItems, selectedItem }) {
  const sortItemsTemplate = sortItems.map(({ id, name, disabled = false }) => `
    <div class="trip-sort__item  trip-sort__item--${id}">
      <input
          id="sort-${id}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${id}"
          ${selectedItem === id ? 'checked' : ''}
          ${disabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${id}">${name}</label>
    </div>
  `).join('');

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>
  `;
}

const SORT_ITEMS = [
  { id: 'day', name: 'Day' },
  { id: 'event', name: 'Event', disabled: true },
  { id: 'time', name: 'Time' },
  { id: 'price', name: 'Price' },
  { id: 'offers', name: 'Offers', disabled: true },
];

export default class SortView extends AbstractView {
  #selectedItem = null;

  constructor(selectedItem) {
    super();
    this.#selectedItem = selectedItem;
  }

  get template() {
    return createSortTemplate({ sortItems: SORT_ITEMS, selectedItem: this.#selectedItem });
  }
}
