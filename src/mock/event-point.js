import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomSubarray,
  generatePictures
} from '../utils.js';

import {
  EVENT_TYPES,
  CITIES,
  DESTINATION_DESCRIPTIONS,
  OFFER_TITLES
} from '../const.js';

function generateDestination() {
  const city = getRandomArrayElement(CITIES);
  const sentencesCount = getRandomInteger(1, 3);
  const description = Array.from({ length: sentencesCount }, () =>
    getRandomArrayElement(DESTINATION_DESCRIPTIONS)
  ).join(' ');

  const pictures = generatePictures(3);

  return {
    id: city.toLowerCase(),
    name: city,
    description: description,
    pictures: pictures
  };
}

function generateOffersForType(type) {
  const titles = OFFER_TITLES[type] || ['Standard offer'];
  const offersCount = getRandomInteger(2, 4);

  return Array.from({ length: offersCount }, (_, index) => ({
    id: `${type}-${index + 1}`,
    title: titles[index % titles.length],
    price: getRandomInteger(5, 50)
  }));
}

function generateEventPoint(id) {
  const type = getRandomArrayElement(EVENT_TYPES);
  const destination = generateDestination();
  const availableOffers = generateOffersForType(type);
  const selectedOffers = getRandomSubarray(availableOffers, 2);

  const now = new Date();
  const startOffset = getRandomInteger(-3, 10);
  const dateFrom = new Date(now);
  dateFrom.setDate(now.getDate() + startOffset);
  dateFrom.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59), 0, 0);

  const durationHours = getRandomInteger(1, 48);
  const dateTo = new Date(dateFrom);
  dateTo.setHours(dateFrom.getHours() + durationHours);

  return {
    id: `event-${id}`,
    type: type,
    destination: destination,
    dateFrom: dateFrom,
    dateTo: dateTo,
    basePrice: getRandomInteger(20, 300),
    offers: selectedOffers,
    isFavorite: Math.random() > 0.7
  };
}

const EVENT_POINTS_COUNT = 10;
const mockEventPoints = Array.from({ length: EVENT_POINTS_COUNT }, (_, i) =>
  generateEventPoint(i + 1)
);

let currentIndex = 0;
export function getNextEventPoint() {
  const point = mockEventPoints[currentIndex];
  currentIndex = (currentIndex + 1) % mockEventPoints.length;
  return { ...point, id: `event-${Date.now()}-${currentIndex}` };
}

export function getAllEventPoints() {
  return mockEventPoints.map((point) => ({ ...point }));
}

export function getEventPointById(id) {
  return mockEventPoints.find((event) => event.id === id) || null;
}

export function resetEventPointIndex() {
  currentIndex = 0;
}
