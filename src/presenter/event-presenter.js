import { render, replace, remove } from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #container = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #allDestinations = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({ container, onDataChange, onModeChange, allDestinations }) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#allDestinations = allDestinations || [];
  }

  init(point) {
    if (!point) {
      return;
    }

    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const destination = this.#allDestinations.find((d) => d.id === point.destination?.id) || point.destination || { name: '', description: '', pictures: [] };
    const offers = point.offers || [];

    this.#pointComponent = new RoutePointView({
      point: this.#point,
      destination: destination,
      offers: offers,
      onRollupClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new FormEditView({
      point: this.#point,
      allDestinations: this.#allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleCloseClick,
      onRollupClick: this.#handleCloseClick,
    });

    if (prevPointComponent === null || prevPointComponent === undefined) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    if (prevPointComponent) {
      remove(prevPointComponent);
    }
    if (prevPointEditComponent) {
      remove(prevPointEditComponent);
    }
  }

  destroy() {
    if (this.#pointComponent) {
      remove(this.#pointComponent);
    }
    if (this.#pointEditComponent) {
      remove(this.#pointEditComponent);
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    this.#handleModeChange();
    replace(this.#pointEditComponent, this.#pointComponent);
    if (this.#pointEditComponent._restoreHandlers) {
      this.#pointEditComponent._restoreHandlers();
    }

    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
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
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(updatedPoint);
    this.#replaceFormToCard();
  };
}
