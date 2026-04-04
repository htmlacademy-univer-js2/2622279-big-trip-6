import { replace } from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';

export default class EventPresenter {
  #event = null;
  #eventView = null;
  #editView = null;
  #isEditing = false;
  #container = null;
  #onDataChange = null;
  #onModeChange = null;

  constructor({ event, onDataChange, onModeChange }) {
    this.#event = event;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(container) {
    this.#container = container;
    this.#renderEvent();
  }

  #renderEvent() {
    const destination = this.#event.destination || { name: '', description: '', pictures: [] };
    const offers = this.#event.offers || [];

    this.#eventView = new RoutePointView({
      event: this.#event,
      destination: destination,
      offers: offers,
      onRollupClick: () => this.#swapToEdit(),
      onFavoriteClick: () => this.#handleFavorite()
    });

    this.#editView = new FormEditView({
      point: this.#event,
      onFormSubmit: () => this.#handleFormSubmit(),
      onResetClick: () => this.#handleReset(),
      onRollupClick: () => this.#swapToEvent(),
      onTypeChange: (newType) => this.#handleTypeChange(newType)
    });

    document.addEventListener('keydown', this.#handleKeydown);
    this.#container.append(this.#eventView.element);
  }

  #handleFavorite() {
    const updatedEvent = {
      ...this.#event,
      isFavorite: !this.#event.isFavorite
    };
    this.#onDataChange(updatedEvent);
  }

  #handleFormSubmit() {
    // Пока просто закрываем форму
    this.#swapToEvent();
  }

  #handleReset() {
    // Пока просто закрываем форму
    this.#swapToEvent();
  }

  #handleTypeChange(newType) {
    const updatedEvent = {
      ...this.#event,
      type: newType,
      offers: []
    };
    this.#event = updatedEvent;

    const newEditView = new FormEditView({
      point: this.#event,
      onFormSubmit: () => this.#handleFormSubmit(),
      onResetClick: () => this.#handleReset(),
      onRollupClick: () => this.#swapToEvent(),
      onTypeChange: (type) => this.#handleTypeChange(type)
    });

    replace(newEditView, this.#editView);
    this.#editView = newEditView;
  }

  #swapToEdit() {
    if (this.#isEditing) {
      return;
    }
    this.#onModeChange();
    replace(this.#editView, this.#eventView);
    this.#isEditing = true;
  }

  #swapToEvent() {
    if (!this.#isEditing) {
      return;
    }
    replace(this.#eventView, this.#editView);
    this.#isEditing = false;
  }

  #handleKeydown = (evt) => {
    if (evt.key === 'Escape' && this.#isEditing) {
      evt.preventDefault();
      this.#swapToEvent();
    }
  };

  resetView() {
    if (this.#isEditing) {
      this.#swapToEvent();
    }
  }

  destroy() {
    if (this.#eventView) {
      this.#eventView.removeElement();
    }
    if (this.#editView) {
      this.#editView.removeElement();
    }
    document.removeEventListener('keydown', this.#handleKeydown);
  }

  updateElement(newEvent) {
    this.#event = newEvent;

    const destination = this.#event.destination || { name: '', description: '', pictures: [] };
    const offers = this.#event.offers || [];

    const newEventView = new RoutePointView({
      event: this.#event,
      destination: destination,
      offers: offers,
      onRollupClick: () => this.#swapToEdit(),
      onFavoriteClick: () => this.#handleFavorite()
    });

    replace(newEventView, this.#eventView);
    this.#eventView = newEventView;
  }

  getEvent() {
    return this.#event;
  }
}
