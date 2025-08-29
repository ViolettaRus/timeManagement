import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme, getTheme } from './theme';
import GlobalStyles from './GlobalStyles';

const ThemeProvider = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
};

export { getTheme };
export default ThemeProvider;