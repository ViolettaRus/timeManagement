import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { createProject, updateProject } from '../../../store/slices/projectsSlice';
import { Button, Input, Select } from '../../UI';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing?.(4) || '16px'};
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors?.background?.paper || '#ffffff'};
  padding: ${props => props.theme.spacing?.(6) || '24px'};
  border-radius: ${props => props.theme.borderRadius?.xl || '16px'};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows?.xl || '0 20px 25px -5px rgba(0, 0, 0, 0.1)'};
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing?.(4) || '16px'};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.colors?.text?.secondary || '#52525b'};
  padding: ${props => props.theme.spacing?.(1) || '4px'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  
  &:hover {
    color: ${props => props.theme.colors?.text?.primary || '#18181b'};
    background: ${props => props.theme.colors?.background?.subtle || '#f4f4f5'};
  }
`;

const ColorInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing?.(3) || '12px'};
  margin-bottom: ${props => props.theme.spacing?.(4) || '16px'};
`;

const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  background-color: ${({ $color }) => $color};
  border: 2px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  flex-shrink: 0;
`;

const ColorInput = styled.input`
  flex: 1;
  height: 40px;
  border: 2px solid ${props => props.theme.colors?.border?.light || '#e4e4e7'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors?.primary?.[500] || '#0ea5e9'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing?.(3) || '12px'};
  margin-top: ${props => props.theme.spacing?.(6) || '24px'};
  justify-content: flex-end;
`;

const colorOptions = [
  { value: '#3b82f6', label: 'Синий' },
  { value: '#ef4444', label: 'Красный' },
  { value: '#10b981', label: 'Зеленый' },
  { value: '#f59e0b', label: 'Желтый' },
  { value: '#8b5cf6', label: 'Фиолетовый' },
  { value: '#ec4899', label: 'Розовый' },
  { value: '#06b6d4', label: 'Бирюзовый' }
];

export default function ProjectForm({ isOpen, onClose, project }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        color: project.color || '#3b82f6',
        status: project.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6',
        status: 'active'
      });
    }
    setError('');
  }, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (project) {
        await dispatch(updateProject({ 
          id: project.id || project._id, 
          ...formData 
        })).unwrap();
      } else {
        await dispatch(createProject(formData)).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err || 'Ошибка сохранения проекта');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <FormHeader>
          <h2>{project ? 'Редактировать проект' : 'Создать проект'}</h2>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </FormHeader>

        {error && (
          <div style={{ 
            color: '#ef4444', 
            marginBottom: '20px', 
            padding: '12px',
            background: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Название проекта"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Введите название проекта"
          />

          <Input
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            as="textarea"
            rows={3}
            disabled={loading}
            placeholder="Опишите проект (необязательно)"
          />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Цвет проекта
            </label>
            <ColorInputContainer>
              <ColorPreview $color={formData.color} />
              <ColorInput
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                disabled={loading}
              />
            </ColorInputContainer>
            <div style={{ 
              fontSize: '14px', 
              color: '#52525b',
              marginTop: '4px'
            }}>
              Выберите цвет для идентификации проекта
            </div>
          </div>

          <Select
            label="Статус"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Активный' },
              { value: 'completed', label: 'Завершенный' },
              { value: 'archived', label: 'Архивный' }
            ]}
            disabled={loading}
          />

          <ButtonGroup>
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : (project ? 'Сохранить' : 'Создать')}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}