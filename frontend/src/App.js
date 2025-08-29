import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { GlobalStyles } from './theme/GlobalStyles';
import AppRoutes from './routes';
import { store } from './store/store';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Layout>
          <AppRoutes />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default App;