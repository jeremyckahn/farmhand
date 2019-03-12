import { plotContentType } from '../enums';

export const testCrop = (item = {}) => ({
  daysOld: 0,
  daysWatered: 0,
  itemId: '',
  type: plotContentType.CROP,
  wasWateredToday: false,
  ...item,
});

export const testItem = (item = {}) => ({
  id: '',
  name: '',
  value: 0,
  ...item,
});
