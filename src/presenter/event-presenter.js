import { replace } from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';

export default class EventPresenter {
  #event;
  #eventView;
  #editView;
  #isEditing = false;
  #container;
  #onDataChange;

  constructor(event) {
    this.#event = event;
  }

  init(container, onDataChange) {
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#renderEvent();
  }

  #renderEvent() {
    const destination = this.#event.destination || { name: '', description: '', pictures: [] };
    const offers = this.#event.offers || [];

    this.#eventView = new RoutePointView(
      this.#event,
      destination,
      offers,
      () => this.#swapToEdit(),
      () => this.#handleFavorite()
    );

    this.#editView = new FormEditView({
      point: this.#event,
      onFormSubmit: (formData) => this.#handleFormSubmit(formData),
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
    this.#onDataChange?.(updatedEvent);
  }

  #handleFormSubmit(formData) {
    const destination = {
      name: formData.destinationName,
      description: this.#event.destination?.description || '',
      pictures: this.#event.destination?.pictures || []
    };

    const updatedEvent = {
      ...this.#event,
      type: formData.type,
      destination: destination,
      dateFrom: new Date(formData.startDateTime),
      dateTo: new Date(formData.endDateTime),
      basePrice: formData.price,
      offers: formData.offers
    };

    this.#onDataChange?.(updatedEvent);
    this.#swapToEvent();
  }

  #handleReset() {
    if (this.#event.id) {
      this.#onDataChange?.(null, this.#event.id);
    }
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
      onFormSubmit: (formData) => this.#handleFormSubmit(formData),
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

  destroy() {
    if (this.#eventView) {
      this.#eventView.removeElement();
    }
    if (this.#editView) {
      this.#editView.removeElement();
    }
    document.removeEventListener('keydown', this.#handleKeydown);
  }

  getEvent() {
    return this.#event;
  }
}
