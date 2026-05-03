import RoutePointView from '../view/route-point-view.js';
import FormEditView from '../view/form-edit-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter {
  #eventsContainer = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #point = null;
  #pointComponent = null;
  #editComponent = null;
  #mode = Mode.DEFAULT;

  constructor({ eventsContainer, destinations, offers, onDataChange, onModeChange }) {
    this.#eventsContainer = eventsContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    const destination = this.#destinations?.find((d) => d.id === point.destination) || { name: '', description: '', pictures: [] };
    const pointOffers = this.#getFullOffers(point.type, point.offers || []);

    this.#pointComponent = new RoutePointView({
      point: this.#point,
      destination: destination,
      offers: pointOffers,
      onRollupClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editComponent = new FormEditView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleResetClick,
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

  #getFullOffers(eventType, selectedOfferIds) {
    const offersByType = this.#offers[eventType] || [];
    return offersByType.filter((offer) => selectedOfferIds.includes(offer.id));
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
    this.#replaceFormToCard();
  };

  #handleResetClick = async () => {
    if (this.#point.id) {
      try {
        await this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MAJOR, this.#point);
      } catch (error) {
        if (this.#editComponent && this.#editComponent.shake) {
          this.#editComponent.shake();
        }
      }
    } else {
      this.#replaceFormToCard();
    }
  };

  #handleFavoriteClick = async () => {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };
    try {
      await this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
      this.#point = updatedPoint;
    } catch (error) {
      // Можно показать ошибку, но по заданию пока не требуется
    }
  };

  #handleFormSubmit = async (updatedPoint) => {
    if (!this.#isValid(updatedPoint)) {
      if (this.#editComponent && this.#editComponent.shake) {
        this.#editComponent.shake();
      }
      return;
    }

    try {
      const pointForSubmit = {
        ...updatedPoint,
        destination: updatedPoint.destination.id || updatedPoint.destination
      };
      await this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MAJOR, pointForSubmit);
      this.#point = updatedPoint;
      this.#replaceFormToCard();
    } catch (error) {
      if (this.#editComponent && this.#editComponent.shake) {
        this.#editComponent.shake();
      }
    }
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
}
