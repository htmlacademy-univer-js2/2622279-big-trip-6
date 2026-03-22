import { replace } from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';

export default class EventPresenter {
  #event;
  #offersModel;
  #destinationsModel;
  #eventView;
  #editView;
  #isEditing = false;
  #container;
  #onDataChange;

  constructor(event, offersModel, destinationsModel) {
    this.#event = event;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(container, onDataChange) {
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#renderEvent();
  }

  #renderEvent() {
    const offers = this.#offersModel?.getByType(this.#event.type) || [];
    const destination = this.#destinationsModel?.getById(this.#event.destination) || this.#event.destination;

    this.#eventView = new RoutePointView(
      this.#event,
      destination,
      this.#event.offers,
      () => this.#swapToEdit(),
      () => this.#handleFavorite()
    );

    this.#editView = new FormEditView(
      this.#event,
      offers,
      destination,
      () => this.#swapToEvent(),
      () => this.#swapToEvent(),
      () => this.#swapToEvent()
    );

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
    this.#eventView?.removeElement();
    this.#editView?.removeElement();
    document.removeEventListener('keydown', this.#handleKeydown);
  }
}
