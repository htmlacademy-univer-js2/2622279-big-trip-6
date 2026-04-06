import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPE } from '../const.js';

function createSortTemplate(selectedSortType) {
  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      <div class="trip-sort__item trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SORT_TYPE.DAY}" ${selectedSortType === SORT_TYPE.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day" data-sort-type="${SORT_TYPE.DAY}">Day</label>
      </div>

      <div class="trip-sort__item trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SORT_TYPE.TIME}" ${selectedSortType === SORT_TYPE.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time" data-sort-type="${SORT_TYPE.TIME}">Time</label>
      </div>

      <div class="trip-sort__item trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SORT_TYPE.PRICE}" ${selectedSortType === SORT_TYPE.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price" data-sort-type="${SORT_TYPE.PRICE}">Price</label>
      </div>

      <div class="trip-sort__item trip-sort__item--offers">
        <input id="sort-offers" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-offers" disabled>
        <label class="trip-sort__btn" for="sort-offers">Offers</label>
      </div>
    </form>
  `;
}

export default class SortingView extends AbstractView {
  #selectedSortType = null;
  #onSortTypeChange = null;

  constructor({ selectedSortType, onSortTypeChange }) {
    super();
    this.#selectedSortType = selectedSortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.querySelectorAll('.trip-sort__btn').forEach((btn) => {
      const sortType = btn.dataset.sortType;
      if (sortType) {
        btn.addEventListener('click', this.#sortTypeChangeHandler);
      }
    });
  }

  get template() {
    return createSortTemplate(this.#selectedSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    const sortType = evt.currentTarget.dataset.sortType;
    if (sortType && this.#selectedSortType !== sortType) {
      const radioInput = this.element.querySelector(`input[data-sort-type="${sortType}"]`);
      if (radioInput) {
        radioInput.checked = true;
      }
      this.#onSortTypeChange(sortType);
    }
  };
}
