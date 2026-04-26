export const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

export const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomSubarray = (array, count) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

export const generatePictures = (count) => Array.from({ length: count }, (_, i) => ({
  src: `https://picsum.photos/id/${Math.floor(Math.random() * 200) + 1}/248/152`,
  description: `Photo ${i + 1}`
}));

export const isPointFuture = (point) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pointDate = new Date(point.dateFrom);
  const pointDay = new Date(pointDate.getFullYear(), pointDate.getMonth(), pointDate.getDate());
  return pointDay > today;
};

export const isPointPast = (point) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pointEndDate = new Date(point.dateTo);
  const pointEndDay = new Date(pointEndDate.getFullYear(), pointEndDate.getMonth(), pointEndDate.getDate());
  return pointEndDay < today;
};

export const isPointPresent = (point) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(point.dateFrom);
  const end = new Date(point.dateTo);
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return startDate <= today && endDate >= today;
};

export const isEscapeKey = (evt) => evt.key === 'Escape';
