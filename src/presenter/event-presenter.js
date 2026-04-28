import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';
import { render, replace, remove } from '../framework/render.js';
import { destinationsMock } from '../mock/destinations-mock.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter {
  #eventsContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #point = null;
  #pointComponent = null;
  #editComponent = null;
  #mode = Mode.DEFAULT;

  constructor({ eventsContainer, onDataChange, onModeChange }) {
    this.#eventsContainer = eventsContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    const destination = destinationsMock.find((d) => d.id === point.destination) || point.destination || { name: '', description: '', pictures: [] };
    const offers = point.offers || [];

    this.#pointComponent = new RoutePointView({
      point: this.#point,
      destination: destination,
      offers: offers,
      onRollupClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editComponent = new FormEditView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleCloseClick,
      onRollupClick: this.#handleCloseClick
    });

    if (prevPointComponent === null || prevPointComponent === undefined) {
      if (this.#eventsContainer) {
        render(this.#pointComponent, this.#eventsContainer);
      }
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      if (prevPointComponent.element && prevPointComponent.element.parentNode) {
        replace(this.#pointComponent, prevPointComponent);
      }
    }

    if (this.#mode === Mode.EDITING) {
      if (prevEditComponent && prevEditComponent.element && prevEditComponent.element.parentNode) {
        replace(this.#editComponent, prevEditComponent);
      }
    }

    if (prevPointComponent) {
      remove(prevPointComponent);
    }
    if (prevEditComponent) {
      remove(prevEditComponent);
    }
  }

  destroy() {
    if (this.#pointComponent) {
      remove(this.#pointComponent);
    }
    if (this.#editComponent) {
      remove(this.#editComponent);
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    this.#handleModeChange();
    if (this.#editComponent && this.#pointComponent && this.#pointComponent.element && this.#pointComponent.element.parentNode) {
      replace(this.#editComponent, this.#pointComponent);
    }
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    if (this.#pointComponent && this.#editComponent && this.#editComponent.element && this.#editComponent.element.parentNode) {
      replace(this.#pointComponent, this.#editComponent);
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleCloseClick = () => {
    if (this.#point && this.#point.id) {
      this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, this.#point);
    }
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
    this.#replaceFormToCard();
  };
}
