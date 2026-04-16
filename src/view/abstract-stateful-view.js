import AbstractView from './abstract-view.js';

export default class AbstractStatefulView extends AbstractView {
  #state = {};

  constructor() {
    super();
    this.#setState(this._getState());
  }

  get state() {
    return this.#state;
  }

  set state(newState) {
    this.#setState(newState);
    this.#rerender();
  }

  #setState(newState) {
    this.#state = structuredClone(newState);
  }

  #rerender() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }

  updateElement(init) {
    if (init) {
      this._setState(this._getState());
    }
    this.#rerender();
  }

  _getState() {
    throw new Error('Abstract method not implemented: _getState');
  }

  _restoreHandlers() {
    throw new Error('Abstract method not implemented: _restoreHandlers');
  }
}
