import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import { setTheme } from '../../store/slices/themeSlice';
import {
  Container,
  Card,
  Form,
  FormControl,
  Label,
  Input,
  Select,
  Button,
  ErrorText,
  FlexContainer
} from '../../components/UI';
import { Snackbar } from '../../components/UI/Snackbar';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const currentTheme = useSelector(state => state.theme.mode);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    theme: currentTheme,
    timeFormat: '24h',
    timeUnit: 'hours'
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        theme: user.settings?.theme || currentTheme,
        timeFormat: user.settings?.timeFormat || '24h',
        timeUnit: user.settings?.timeUnit || 'hours'
      });
    }
  }, [user, currentTheme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'theme') {
      dispatch(setTheme(value));
    }
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    setFormData(prev => ({ ...prev, theme: newTheme }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(updateUser({
      username: formData.username,
      email: formData.email,
      settings: {
        theme: formData.theme,
        timeFormat: formData.timeFormat,
        timeUnit: formData.timeUnit
      }
    }));

    if (updateUser.fulfilled.match(resultAction)) {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Card>
        <h1>⚙️ Настройки</h1>
        
        {error && (
          <ErrorText>{error}</ErrorText>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormControl>
            <Label>👤 Имя пользователя</Label>
            <Input
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите ваше имя"
            />
          </FormControl>
          
          <FormControl>
            <Label>📧 Email</Label>
            <Input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
            />
          </FormControl>
          
          <FormControl>
            <FlexContainer justify="space-between" align="center">
              <Label>🎨 Тема: {formData.theme === 'light' ? 'Светлая' : 'Тёмная'}</Label>
              <Button
                type="button"
                variant="outlined"
                onClick={handleThemeToggle}
              >
                {formData.theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
              </Button>
            </FlexContainer>
            <Select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              style={{ marginTop: '0.5rem' }}
            >
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <Label>⏰ Формат времени</Label>
            <Select
              name="timeFormat"
              value={formData.timeFormat}
              onChange={handleChange}
            >
              <option value="12h">12-часовой (AM/PM)</option>
              <option value="24h">24-часовой</option>
            </Select>
          </FormControl>

          <FormControl>
            <Label>📊 Единицы измерения времени</Label>
            <Select
              name="timeUnit"
              value={formData.timeUnit}
              onChange={handleChange}
            >
              <option value="hours">Часы (по умолчанию)</option>
              <option value="minutes">Минуты</option>
              <option value="seconds">Секунды</option>
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? '💾 Сохранение...' : '💾 Сохранить настройки'}
          </Button>
        </Form>

        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message="✅ Настройки успешно сохранены"
          variant="success"
          autoHideDuration={3000}
        />
      </Card>
    </Container>
  );
};

export default SettingsPage;