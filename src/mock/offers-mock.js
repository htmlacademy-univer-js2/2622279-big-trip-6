function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const minPrice = 10;
const maxPrice = 100;

export const offersMock = [
  {
    type: 'taxi',
    offers: [
      { id: 'a6f0e4f8-26b8-465e-af4b-5b66c593507f', title: 'Upgrade to a business class', price: getRandomPrice(minPrice, maxPrice) },
      { id: '90a8c8d8-1887-452a-aa3c-ce79b214eac8', title: 'Choose temperature', price: getRandomPrice(minPrice, maxPrice) },
      { id: 'c11b65d1-4048-4c7f-bb86-20fbfdbd6a66', title: 'Drive quickly, I\'m in a hurry', price: getRandomPrice(minPrice, maxPrice) },
      { id: 'db0179e2-db4a-451f-9101-c31b670ec1e2', title: 'Drive slowly', price: getRandomPrice(minPrice, maxPrice) }
    ]
  },
  {
    type: 'bus',
    offers: [
      { id: '612b2827-5a68-4e47-9a1b-23a30add0ca4', title: 'Infotainment system', price: getRandomPrice(minPrice, maxPrice) },
      { id: '289ff284-78a7-4a69-a59a-cd4bcfc705a7', title: 'Order meal', price: getRandomPrice(minPrice, maxPrice) },
      { id: 'c39b03b1-f07d-4c80-8651-cda65110a501', title: 'Choose seats', price: getRandomPrice(minPrice, maxPrice) }
    ]
  },
  {
    type: 'train',
    offers: [
      { id: 'c59cd20b-83f9-4f0f-87c2-4f9caf671ab8', title: 'Book a taxi at the arrival point', price: getRandomPrice(minPrice, maxPrice) },
      { id: '2d8e6f88-bce4-4c95-abc3-adb9f6531f92', title: 'Order a breakfast', price: getRandomPrice(minPrice, maxPrice) },
      { id: 'f213b77e-0b9e-4d33-ab84-ef7e31c4af56', title: 'Wake up at a certain time', price: getRandomPrice(minPrice, maxPrice) }
    ]
  },
  {
    type: 'flight',
    offers: [
      { id: '7993db05-310a-4856-a74b-a6d80b1b5b49', title: 'Choose meal', price: getRandomPrice(minPrice, maxPrice) },
      { id: '0f41fdde-626d-4752-a680-6ae86ea1ca63', title: 'Choose seats', price: getRandomPrice(minPrice, maxPrice) },
      { id: '86ea6ce2-ebd5-4a6e-9ace-8b431abc27c7', title: 'Upgrade to comfort class', price: getRandomPrice(minPrice, maxPrice) },
      { id: 'cd788072-c059-4de8-91c3-4b484b19e655', title: 'Upgrade to business class', price: getRandomPrice(minPrice, maxPrice) },
      { id: '3b38fe7e-6530-40d5-a600-79538acd1dd1', title: 'Add luggage', price: getRandomPrice(minPrice, maxPrice) },
      { id: '138438eb-eb54-4f48-9f54-c1ba1ad26cdf', title: 'Business lounge', price: getRandomPrice(minPrice, maxPrice) }
    ]
  },
  {
    type: 'check-in',
    offers: [
      { id: 'b7730c4f-9b4e-4c5f-ba93-3e186dca42e6', title: 'Choose the time of check-in', price: getRandomPrice(minPrice, maxPrice) },
      { id: '9bb07f8b-e82b-4738-8b5a-5c6bae30ad90', title: 'Choose the time of check-out', price: getRandomPrice(minPrice, maxPrice) },
      { id: '89cd5a4f-571c-410d-a4f2-1adb589dcdce', title: 'Add breakfast', price: getRandomPrice(minPrice, maxPrice) },
      { id: '1fbc49c6-2e99-488b-95bd-87739f32c533', title: 'Laundry', price: getRandomPrice(minPrice, maxPrice) },
      { id: '836e9bd6-d532-4867-b99a-cd339a57dc05', title: 'Order a meal from the restaurant', price: getRandomPrice(minPrice, maxPrice) }
    ]
  },
  {
    type: 'ship',
    offers: [
      { id: 'e738c013-c58e-4ac8-93e7-9d1e13660920', title: 'Choose meal', price: getRandomPrice(minPrice, maxPrice) },
      { id: '7c242e33-9390-4f28-84ed-bf352809944a', title: 'Choose seats', price: getRandomPrice(minPrice, maxPrice) },
      { id: '8fcead10-05f2-440a-9fb8-fd1b6389dc98', title: 'Upgrade to comfort class', price: getRandomPrice(minPrice, maxPrice) },
      { id: 'bf082dcc-2af6-470d-a049-26a746d244dd', title: 'Upgrade to business class', price: getRandomPrice(minPrice, maxPrice) },
      { id: '9289150c-b8c2-44a0-bc44-94f5cd8e7894', title: 'Add luggage', price: getRandomPrice(minPrice, maxPrice) },
      { id: 'bef15b9f-e8a2-409c-85ac-92bdaf461759', title: 'Business lounge', price: getRandomPrice(minPrice, maxPrice) }
    ]
  },
  {
    type: 'drive',
    offers: [
      { id: '01937f8d-16bd-423c-89d8-eb046735c1b7', title: 'With automatic transmission', price: getRandomPrice(minPrice, maxPrice) },
      { id: '48f5964e-267d-4b41-804e-ffc531ebd023', title: 'With air conditioning', price: getRandomPrice(minPrice, maxPrice) }
    ]
  },
  {
    type: 'sightseeing',
    offers: []
  },
  {
    type: 'restaurant',
    offers: [
      { id: '4fb723a2-cf55-421a-b77b-b3317e2463ca', title: 'Choose live music', price: getRandomPrice(minPrice, maxPrice) },
      { id: '429b80d4-0961-4511-a8c8-689252e6efe0', title: 'Choose VIP area', price: getRandomPrice(minPrice, maxPrice) }
    ]
  }
];
