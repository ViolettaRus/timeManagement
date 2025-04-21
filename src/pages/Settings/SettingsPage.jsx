import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, clearError } from '../../store/slices/authSlice';
import { setTheme } from '../../store/slices/themeSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const currentTheme = useSelector(state => state.theme.mode);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    theme: currentTheme,
    timeFormat: '24h'
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        theme: user.settings?.theme || currentTheme,
        timeFormat: user.settings?.timeFormat || '24h'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(updateUser({
      username: formData.username,
      email: formData.email,
      settings: {
        theme: formData.theme,
        timeFormat: formData.timeFormat
      }
    }));

    if (updateUser.fulfilled.match(resultAction)) {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          margin="normal"
          fullWidth
          required
          label="Имя пользователя"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        
        <TextField
          margin="normal"
          fullWidth
          required
          type="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Тема</InputLabel>
          <Select
            name="theme"
            value={formData.theme}
            label="Тема"
            onChange={handleChange}
          >
            <MenuItem value="light">Светлая</MenuItem>
            <MenuItem value="dark">Тёмная</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Формат времени</InputLabel>
          <Select
            name="timeFormat"
            value={formData.timeFormat}
            label="Формат времени"
            onChange={handleChange}
          >
            <MenuItem value="12h">12-часовой</MenuItem>
            <MenuItem value="24h">24-часовой</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Сохранить настройки'}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Настройки успешно сохранены"
      />
    </Box>
  );
};

export default SettingsPage;