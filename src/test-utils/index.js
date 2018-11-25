export const testCrop = (item = {}) => ({
  itemId: '',
  daysOld: 0,
  daysWatered: 0,
  wasWateredToday: false,
  ...item,
});

export const testItem = (item = {}) => ({
  id: '',
  name: '',
  value: 0,
  ...item,
});
