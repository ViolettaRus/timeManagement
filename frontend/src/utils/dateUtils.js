export const safeParseISO = (dateString) => {
  if (!dateString) {
    console.warn('Дата не определена, используется текущая дата');
    return new Date();
  }
  
  try {
    if (dateString instanceof Date) {
      return dateString;
    }
    
    if (typeof dateString === 'number' || !isNaN(dateString)) {
      return new Date(Number(dateString));
    }
    
    if (typeof dateString === 'string') {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
      
      const timestamp = Date.parse(dateString);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
    }
    
    console.warn('Не удалось распарсить дату:', dateString);
    return new Date();
  } catch (error) {
    console.error('Ошибка парсинга даты:', error, dateString);
    return new Date();
  }
};

export const isWithinDateRange = (date, start, end) => {
  try {
    const dateObj = safeParseISO(date);
    const startObj = safeParseISO(start);
    const endObj = safeParseISO(end);
    
    return dateObj >= startObj && dateObj <= endObj;
  } catch (error) {
    console.error('Ошибка проверки диапазона дат:', error);
    return false;
  }
};

export const formatDateRange = (start, end) => {
  const startDate = safeParseISO(start);
  const endDate = safeParseISO(end);
  
  return {
    start: startDate,
    end: endDate,
    formatted: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  };
};