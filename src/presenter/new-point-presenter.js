import { render, remove } from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';
import { isEscapeKey } from '../utils.js';

const BLANK_POINT = {
  id: null,
  type: 'flight',
  destination: null,
  dateFrom: null,
  dateTo: null,
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
  #isSaving = false;
  #hasError = false;

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

    const callback = this.#destroyCallback;

    if (this.#pointEditComponent.element && this.#pointEditComponent.element.parentNode) {
      remove(this.#pointEditComponent);
    }
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    if (callback) {
      callback();
    }
  }

  forceDestroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    if (this.#pointEditComponent.element && this.#pointEditComponent.element.parentNode) {
      remove(this.#pointEditComponent);
    }
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  getComponent() {
    return this.#pointEditComponent;
  }

  #handleFormSubmit = async (point) => {
    if (!this.#isValid(point)) {
      this.#pointEditComponent?.shake();
      return;
    }
    if (this.#isSaving) {
      return;
    }

    this.#isSaving = true;
    this.#pointEditComponent?.setSaving(true);

    try {
      const pointForSubmit = {
        ...point,
        destination: point.destination.id || point.destination
      };
      await this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, pointForSubmit);
      this.destroy();
    } catch (error) {
      this.#hasError = true;
      this.#pointEditComponent?.shake();
      this.#pointEditComponent?.setSaving(false);
    } finally {
      this.#isSaving = false;
      if (!this.#hasError) {
        this.#pointEditComponent?.setSaving(false);
      }
    }
  };

  #handleResetClick = () => {
    if (this.#isSaving) {
      return;
    }
    if (this.#hasError) {
      this.#hasError = false;
      this.#pointEditComponent?.setSaving(false);
      return;
    }
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
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      if (this.#isSaving) {
        return;
      }
      this.destroy();
    }
  };
}
