// App.js
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './routes';
import Layout from './components/Layout';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from './store/slices/themeSlice';
import LoadingWrapper from './components/UI/Loader/LoadingWrapper';

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.theme?.mode || 'light');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const userTheme = user?.settings?.theme;
    if (userTheme) {
      dispatch(setTheme(userTheme));
    }
  }, [user, dispatch]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      ...(themeMode === 'dark' ? {
        background: {
          default: '#121212',
          paper: '#1E1E1E',
        },
      } : {}),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <LoadingWrapper>
          <Layout>
            <AppRoutes />
          </Layout>
        </LoadingWrapper>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;