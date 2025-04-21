import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const colors = [
  { value: '#3b82f6', label: 'Синий' },
  { value: '#ef4444', label: 'Красный' },
  { value: '#10b981', label: 'Зеленый' },
  { value: '#f59e0b', label: 'Желтый' },
  { value: '#8b5cf6', label: 'Фиолетовый' },
];

const ColorPicker = ({ value, onChange }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Цвет</InputLabel>
      <Select
        value={value}
        label="Цвет"
        onChange={(e) => onChange(e.target.value)}
      >
        {colors.map((color) => (
          <MenuItem key={color.value} value={color.value}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: color.value,
                  mr: 2,
                  borderRadius: '50%'
                }}
              />
              {color.label}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ColorPicker;