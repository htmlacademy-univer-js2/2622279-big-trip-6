import { render, remove } from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';

const BLANK_POINT = {
  id: null,
  type: 'flight',
  destination: null,
  dateFrom: new Date(),
  dateTo: dayjs().add(1, 'day').toDate(),
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
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleResetClick,
      onRollupClick: this.#handleResetClick
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

  #handleFormSubmit = async (point) => {
    if (!this.#isValid(point)) {
      this.#pointEditComponent?.shake();
      return;
    }

    this.#pointEditComponent?.setSaving(true);

    try {
      await this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, point);
      this.destroy();
    } catch (error) {
      this.#pointEditComponent?.shake();
    } finally {
      if (this.#pointEditComponent) {
        this.#pointEditComponent.setSaving(false);
      }
    }
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #isValid(point) {
    if (!point.type) {
      return false;
    }

    if (!point.destination || !point.destination.id) {
      return false;
    }

    if (!point.dateFrom || !point.dateTo) {
      return false;
    }

    if (dayjs(point.dateTo).isBefore(dayjs(point.dateFrom))) {
      return false;
    }

    if (point.basePrice < 0 || isNaN(point.basePrice)) {
      return false;
    }

    return true;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
