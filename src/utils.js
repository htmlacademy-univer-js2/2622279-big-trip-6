function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomSubarray(items, maxCount) {
  const count = getRandomInteger(0, Math.min(maxCount, items.length));
  const shuffled = items.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePictures(count = 3) {
  const picturesCount = getRandomInteger(1, count);
  const pictures = [];
  for (let i = 0; i < picturesCount; i++) {
    const randomNum = getRandomInteger(1, 1000);
    pictures.push(`https://loremflickr.com/248/152?random=${randomNum}`);
  }
  return pictures;
}

export { getRandomArrayElement, getRandomInteger, getRandomDate, getRandomSubarray, generatePictures };
