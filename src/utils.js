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
