import { DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT, MAX_ROW_PER_PAGE } from '../constants';

export function getRandomString(length) {
  const randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

export function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateValueByRatio(ratio) {
  try {
    let i = 1;
    const ratioFormat = ratio?.map((item) => {
      const data = {
        ...item,
        from: i,
        to: item.ratio + i - 1
      };
      i += item.ratio;
      return data;
    });
    const random = randomIntFromInterval(1, 100);
    return ratioFormat?.find(item => item.from <= random && item.to >= random)?.value || null;
  } catch (error) {
    console.log('Error in generateValueByRatio', error);
  }
}


export const conditionTimeInDay = (time) => {
  const currentTime = new Date(time).toISOString();
  return {
    $gte: `${currentTime.substring(0, currentTime.length - 13)}00:00:00.000Z`,
    $lte: `${currentTime.substring(0, currentTime.length - 13)}23:59:59.999Z`
  };
};

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}


export const getQueryListData = (req) => {
  try {
    let page = Number(req.query.page) || 1;
    if (page < 1 || page > MAX_PAGE_LIMIT) {
      page = MAX_PAGE_LIMIT;
    }
    let limit = Number(req.query.rowPerPage) || DEFAULT_LIMIT_QUERY;
    if (limit < 1 || limit > MAX_ROW_PER_PAGE) {
      limit = MAX_ROW_PER_PAGE;
    }
    const skip = (page - 1) * limit;
    return {
      ...req.query,
      page,
      limit,
      skip
    };
  } catch (error) {
    console.log('Error in getQueryListData', error);
  }
};

export const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const conditionTimeInMonth = (month, year) => {
  const lastDay = daysInMonth(month, year);
  month = Number(month);
  return {
    $gte: `${year}-${month < 10 ? `0${month}` : month}-01T00:00:00.000Z`,
    $lte: `${year}-${month < 10 ? `0${month}` : month}-${lastDay < 10 ? `0${lastDay}` : lastDay}T23:59:59.999Z`
  };
};
