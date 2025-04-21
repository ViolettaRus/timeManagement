import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { projectsActions } from '../../store/slices/projectsSlice';

const schema = yup.object().shape({
  name: yup.string().required('Название проекта обязательно'),
  color: yup.string().required('Цвет обязателен')
});

const colorOptions = [
  { value: '#3b82f6', label: 'Синий' },
  { value: '#ef4444', label: 'Красный' },
  { value: '#10b981', label: 'Зеленый' },
  { value: '#f59e0b', label: 'Желтый' },
  { value: '#8b5cf6', label: 'Фиолетовый' }
];

export default function ProjectForm({ open, onClose, project }) {
  const dispatch = useDispatch();
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: project || {
      name: '',
      color: '#3b82f6'
    }
  });

  const selectedColor = watch('color');

  React.useEffect(() => {
    if (project) {
      setValue('name', project.name);
      setValue('color', project.color);
    }
  }, [project, setValue]);

  const onSubmit = async (data) => {
    try {
      if (project) {
        await dispatch(projectsActions.updateProject({ id: project.id, ...data })).unwrap();
      } else {
        await dispatch(projectsActions.createProject(data)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {project ? 'Редактирование проекта' : 'Новый проект'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Название проекта"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Цвет проекта</InputLabel>
            <Select
              value={selectedColor}
              label="Цвет проекта"
              {...register('color')}
              error={!!errors.color}
            >
              {colorOptions.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: color.value,
                        mr: 2,
                        borderRadius: '4px'
                      }}
                    />
                    {color.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}