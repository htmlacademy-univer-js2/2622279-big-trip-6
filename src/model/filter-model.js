import { FilterType } from '../const.js';

export default class FilterModel {
  #currentFilter = FilterType.EVERYTHING;
  #observers = [];

  getFilter() {
    return this.#currentFilter;
  }

  setFilter(updateType, filter) {
    if (this.#currentFilter === filter) {
      return;
    }
    this.#currentFilter = filter;
    this.#notify(updateType);
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  #notify(updateType) {
    this.#observers.forEach((observer) => observer(updateType));
  }
}
