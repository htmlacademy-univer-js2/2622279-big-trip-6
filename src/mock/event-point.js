const OFFERS_DATA = {
  taxi: [
    { id: 'taxi-1', title: 'Baby seat', price: 15 },
    { id: 'taxi-2', title: 'Pet transportation', price: 25 },
    { id: 'taxi-3', title: 'Wait driver', price: 20 },
    { id: 'taxi-4', title: 'Air conditioning', price: 10 }
  ],
  flight: [
    { id: 'flight-1', title: 'Add luggage', price: 30 },
    { id: 'flight-2', title: 'Business class', price: 150 },
    { id: 'flight-3', title: 'Preference meal', price: 25 },
    { id: 'flight-4', title: 'Seat selection', price: 15 }
  ],
  train: [
    { id: 'train-1', title: 'Meal', price: 20 },
    { id: 'train-2', title: 'Bedding', price: 15 },
    { id: 'train-3', title: 'First class', price: 80 }
  ],
  bus: [
    { id: 'bus-1', title: 'Wi-Fi', price: 5 },
    { id: 'bus-2', title: 'USB charger', price: 8 },
    { id: 'bus-3', title: 'Extra luggage', price: 15 }
  ],
  'check-in': [
    { id: 'check-in-1', title: 'Late checkout', price: 30 },
    { id: 'check-in-2', title: 'Breakfast', price: 20 },
    { id: 'check-in-3', title: 'Early check-in', price: 25 }
  ],
  sightseeing: [
    { id: 'sightseeing-1', title: 'Guide', price: 25 },
    { id: 'sightseeing-2', title: 'Audio guide', price: 10 },
    { id: 'sightseeing-3', title: 'Skip the line', price: 15 }
  ],
  restaurant: [
    { id: 'restaurant-1', title: 'Reservation', price: 15 },
    { id: 'restaurant-2', title: 'VIP zone', price: 50 }
  ]
};

const mockEventPoints = [
  {
    id: 'event-1',
    type: 'flight',
    destination: 'c404e12f-adc3-4d53-bc96-f77c333a17f9',
    dateFrom: new Date(2026, 3, 20, 10, 30),
    dateTo: new Date(2026, 3, 20, 13, 45),
    basePrice: 250,
    offers: [OFFERS_DATA.flight[0], OFFERS_DATA.flight[3]],
    isFavorite: false
  },
  {
    id: 'event-2',
    type: 'check-in',
    destination: 'c404e12f-adc3-4d53-bc96-f77c333a17f9',
    dateFrom: new Date(2026, 3, 20, 15, 0),
    dateTo: new Date(2026, 3, 25, 11, 0),
    basePrice: 450,
    offers: [OFFERS_DATA['check-in'][1]],
    isFavorite: true
  },
  {
    id: 'event-3',
    type: 'train',
    destination: 'ed9300f3-8355-4b7a-9b1a-7374e4b433ba',
    dateFrom: new Date(2026, 3, 25, 12, 0),
    dateTo: new Date(2026, 3, 26, 16, 30),
    basePrice: 120,
    offers: [OFFERS_DATA.train[0], OFFERS_DATA.train[2]],
    isFavorite: false
  },
  {
    id: 'event-4',
    type: 'check-in',
    destination: 'ed9300f3-8355-4b7a-9b1a-7374e4b433ba',
    dateFrom: new Date(2026, 3, 26, 17, 0),
    dateTo: new Date(2026, 3, 30, 10, 0),
    basePrice: 380,
    offers: [OFFERS_DATA['check-in'][0], OFFERS_DATA['check-in'][2]],
    isFavorite: false
  },
  {
    id: 'event-5',
    type: 'sightseeing',
    destination: 'ed9300f3-8355-4b7a-9b1a-7374e4b433ba',
    dateFrom: new Date(2026, 3, 30, 9, 0),
    dateTo: new Date(2026, 3, 30, 17, 0),
    basePrice: 85,
    offers: [OFFERS_DATA.sightseeing[0], OFFERS_DATA.sightseeing[2]],
    isFavorite: false
  },
  {
    id: 'event-6',
    type: 'restaurant',
    destination: 'ed9300f3-8355-4b7a-9b1a-7374e4b433ba',
    dateFrom: new Date(2026, 3, 30, 19, 0),
    dateTo: new Date(2026, 3, 30, 21, 30),
    basePrice: 95,
    offers: [OFFERS_DATA.restaurant[1]],
    isFavorite: false
  },
  {
    id: 'event-7',
    type: 'train',
    destination: 'adc0f62d-9592-467b-92d3-1882deda2ca5',
    dateFrom: new Date(2026, 3, 30, 22, 0),
    dateTo: new Date(2026, 4, 1, 18, 0),
    basePrice: 180,
    offers: [OFFERS_DATA.train[1], OFFERS_DATA.train[2]],
    isFavorite: false
  },
  {
    id: 'event-8',
    type: 'check-in',
    destination: 'adc0f62d-9592-467b-92d3-1882deda2ca5',
    dateFrom: new Date(2026, 4, 1, 19, 0),
    dateTo: new Date(2026, 4, 6, 10, 0),
    basePrice: 420,
    offers: [OFFERS_DATA['check-in'][1]],
    isFavorite: true
  },
  {
    id: 'event-9',
    type: 'sightseeing',
    destination: 'adc0f62d-9592-467b-92d3-1882deda2ca5',
    dateFrom: new Date(2026, 4, 4, 10, 0),
    dateTo: new Date(2026, 4, 4, 16, 0),
    basePrice: 70,
    offers: [OFFERS_DATA.sightseeing[1], OFFERS_DATA.sightseeing[2]],
    isFavorite: false
  },
  {
    id: 'event-10',
    type: 'flight',
    destination: 'adc0f62d-9592-467b-92d3-1882deda2ca5',
    dateFrom: new Date(2026, 4, 6, 12, 0),
    dateTo: new Date(2026, 4, 6, 17, 30),
    basePrice: 220,
    offers: [OFFERS_DATA.flight[1], OFFERS_DATA.flight[2]],
    isFavorite: false
  }
];

let currentIndex = 0;

export function getNextEventPoint() {
  const point = { ...mockEventPoints[currentIndex % mockEventPoints.length] };
  currentIndex++;
  return point;
}

export function getAllEventPoints() {
  return mockEventPoints.map((point) => ({ ...point, offers: [...point.offers] }));
}

export function getEventPointById(id) {
  const point = mockEventPoints.find((event) => event.id === id);
  return point ? { ...point, offers: [...point.offers] } : null;
}

export function resetEventPointIndex() {
  currentIndex = 0;
}
