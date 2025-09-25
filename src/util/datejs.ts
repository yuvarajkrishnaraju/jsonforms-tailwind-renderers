import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';

const INVALID_DATE = 'Invalid Date';

export const createOnChangeHandler = (path: string, handleChange: (path: string, value: any) => void, saveFormat: string) => (time: any) => {
  const result = dayjs(time).format(saveFormat);
  handleChange(path, result === INVALID_DATE ? undefined : result);
};

export const getData = (data: any, saveFormat: string) => {
  if (!(data instanceof Date) && isEmpty(data)) return null;
  const date = data instanceof Date ? data : new Date(data);
  const dayjsData = dayjs(date);
  if (dayjsData.toString() === INVALID_DATE) {
    return new Date();
  }
  // Return the dayjs object directly to preserve timezone information
  // This ensures the date picker receives the correct date in the current timezone
  return dayjsData.toDate();
};
