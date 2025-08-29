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
`;

const ModalContent = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ColorInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  border: 2px solid #ddd;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const ProjectForm = ({ isOpen, onClose, project = null }) => {
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
  }, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (project) {
        await dispatch(updateProject({ id: project.id, ...formData })).unwrap();
      } else {
        await dispatch(createProject(formData)).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка сохранения проекта');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <FormHeader>
          <h2>{project ? 'Редактировать проект' : 'Создать проект'}</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </FormHeader>

        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
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
          />

          <Input
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            as="textarea"
            rows={3}
            disabled={loading}
          />

          <div style={{ marginBottom: '20px' }}>
            <label>Цвет проекта</label>
            <ColorInputContainer>
              <ColorPreview $color={formData.color} />
              <Input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                style={{ flex: 1 }}
                disabled={loading}
              />
            </ColorInputContainer>
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
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : (project ? 'Сохранить' : 'Создать')}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProjectForm;