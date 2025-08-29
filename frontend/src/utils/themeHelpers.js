export const getThemeValue = (theme, path, defaultValue) => {
  if (!theme) {
    console.warn('Theme is undefined, using default value:', defaultValue);
    return defaultValue;
  }
  
  const keys = path.split('.');
  let value = theme;
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    value = value[key];
  }
  
  return value !== undefined ? value : defaultValue;
};

export const DEFAULT_THEME_VALUES = {
  colors: {
    primary: {
      main: '#1976d2',
      light: '#e3f2fd',
      dark: '#1565c0'
    },
    secondary: {
      main: '#9c27b0',
      light: '#f3e5f5',
      dark: '#7b1fa2'
    }
  },
  spacing: (value) => `${8 * value}px`,
  borderRadius: {
    md: '8px'
  }
};