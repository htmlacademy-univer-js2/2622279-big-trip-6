import { render, remove } from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import { UserAction, UpdateType } from '../const.js';

const BLANK_POINT = {
  id: null,
  type: 'flight',
  destination: null,
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: 0,
  offers: [],
  isFavorite: false
};

export default class NewPointPresenter {
  #eventsContainer = null;
  #handleDataChange = null;
  #pointEditComponent = null;
  #destroyCallback = null;
  #eventsModel = null;

  constructor({ eventsContainer, eventsModel, onDataChange }) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#handleDataChange = onDataChange;
  }

  init(callback) {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormEditView({
      point: BLANK_POINT,
      destinations: this.#eventsModel.getDestinations(),
      offers: this.#eventsModel.getOffers(),
      onFormSubmit: (point) => {
        const newPoint = {
          ...point,
          id: `event-${Date.now()}`,
        };
        this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MINOR, newPoint);
        this.destroy();
      },
      onResetClick: () => {
        this.destroy();
      },
      onRollupClick: () => {
        this.destroy();
      }
    });

    render(this.#pointEditComponent, this.#eventsContainer, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
