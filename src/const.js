const EVENT_TYPES = [
  'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
];

const CITIES = [
  'Geneva', 'Madrid', 'Den Haag', 'Berlin', 'Valencia', 'Rome', 'Barcelona', 'Chamonix', 'Oslo', 'Monaco'
];

const DESTINATION_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const OFFER_TITLES = {
  taxi: ['Baby seat', 'Pet transportation', 'Wait driver', 'Air conditioning'],
  bus: ['Wi-Fi', 'USB charger', 'Extra luggage', 'Refreshments'],
  train: ['Meal', 'Bedding', 'Business class', 'First class'],
  ship: ['Cabin with window', 'All inclusive', 'Breakfast', 'Sun deck access'],
  drive: ['Car with conditioner', 'GPS navigation', 'Child seat', 'Full insurance'],
  flight: ['Add luggage', 'Business class', 'Preference meal', 'Insurance', 'Seat selection'],
  'check-in': ['Late checkout', 'Breakfast', 'Early check-in', 'Room with a view'],
  sightseeing: ['Guide', 'Audio guide', 'Skip the line', 'Transport included'],
  restaurant: ['Reservation', 'VIP zone', 'Sommelier', 'Chef\'s table']
};

const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  EVENT_TYPES,
  CITIES,
  DESTINATION_DESCRIPTIONS,
  OFFER_TITLES,
  SORT_TYPE,
  FilterType,
  UserAction,
  UpdateType,
};
