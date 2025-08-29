export const formatTime = (seconds, unit = 'hours') => {
  if (!seconds || seconds <= 0) {
    return unit === 'seconds' ? '0' : unit === 'minutes' ? '0' : '0.0';
  }

  switch (unit) {
    case 'seconds':
      return Math.round(seconds).toString();
    
    case 'minutes':
      return (seconds / 60).toFixed(1);
    
    case 'hours':
    default:
      return (seconds / 3600).toFixed(1);
  }
};

export const getTimeUnitLabel = (unit, value) => {
  switch (unit) {
    case 'seconds':
      return `сек`;
    
    case 'minutes':
      return `мин`;
    
    case 'hours':
    default:
      return `ч`;
  }
};

export const convertTime = (seconds, fromUnit, toUnit) => {
  if (!seconds || seconds <= 0) return 0;

  let valueInSeconds;
  switch (fromUnit) {
    case 'seconds':
      valueInSeconds = seconds;
      break;
    case 'minutes':
      valueInSeconds = seconds * 60;
      break;
    case 'hours':
      valueInSeconds = seconds * 3600;
      break;
    default:
      valueInSeconds = seconds;
  }

  switch (toUnit) {
    case 'seconds':
      return valueInSeconds;
    case 'minutes':
      return valueInSeconds / 60;
    case 'hours':
      return valueInSeconds / 3600;
    default:
      return valueInSeconds / 3600;
  }
};

export const formatTimeWithUnit = (seconds, unit = 'hours') => {
  const value = formatTime(seconds, unit);
  const label = getTimeUnitLabel(unit, value);
  return `${value} ${label}`;
};

export const getReadableTime = (seconds, unit = 'hours') => {
  const value = parseFloat(formatTime(seconds, unit));
  
  switch (unit) {
    case 'seconds':
      return `${Math.round(value)} секунд`;
    
    case 'minutes':
      return `${value} ${value === 1 ? 'минута' : value < 5 ? 'минуты' : 'минут'}`;
    
    case 'hours':
    default:
      if (value < 1) {
        const minutes = Math.round(value * 60);
        return `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'}`;
      }
      return `${value} ${value === 1 ? 'час' : value < 5 ? 'часа' : 'часов'}`;
  }
};