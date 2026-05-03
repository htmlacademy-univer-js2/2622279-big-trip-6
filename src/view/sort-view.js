import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPE } from '../const.js';

function createSortingTemplate(selectedSortType) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="day" data-sort-type="${SORT_TYPE.DAY}" ${selectedSortType === SORT_TYPE.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="time" data-sort-type="${SORT_TYPE.TIME}" ${selectedSortType === SORT_TYPE.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="price" data-sort-type="${SORT_TYPE.PRICE}" ${selectedSortType === SORT_TYPE.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offers">
        <input id="sort-offers" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="offers" disabled>
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

    this.element.querySelectorAll('.trip-sort__input').forEach((input) => {
      if (!input.disabled) {
        input.addEventListener('change', this.#sortTypeChangeHandler);
      }
    });
  }

  get template() {
    return createSortingTemplate(this.#selectedSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const sortType = evt.target.dataset.sortType;

    // Вызываем колбэк даже если сортировка та же самая
    // Но для оптимизации можно проверять
    if (this.#onSortTypeChange) {
      this.#onSortTypeChange(sortType);
    }
  };

  updateSelectedSortType(sortType) {
    this.#selectedSortType = sortType;
    const radio = this.element.querySelector(`input[data-sort-type="${sortType}"]`);
    if (radio) {
      radio.checked = true;
    }
  }
}
