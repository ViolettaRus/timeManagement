import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchProjects, deleteProject } from '../../store/slices/projectsSlice';
import ProjectForm from '../../components/Forms/ProjectForm/ProjectForm';
import { Button } from '../../components/UI';
import Loader from '../../components/UI/Loader/Loader';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing?.(4) || '16px'};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing?.(6) || '24px'};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing?.(3) || '12px'};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors?.text?.primary || '#18181b'};
  margin: 0;
  font-size: ${({ theme }) => theme.typography?.fontSize?.['3xl'] || '30px'};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing?.(4) || '16px'};
  margin-bottom: ${({ theme }) => theme.spacing?.(6) || '24px'};
`;

const ProjectCard = styled.div`
  background: ${({ theme }) => theme.colors?.background?.paper || '#ffffff'};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || '16px'};
  padding: ${({ theme }) => theme.spacing?.(4) || '16px'};
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 1px 3px 0 rgba(0, 0, 0, 0.1)'};
  border-left: 4px solid ${({ color }) => color || '#3b82f6'};
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors?.border?.light || '#e4e4e7'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing?.(3) || '12px'};
`;

const ProjectName = styled.h3`
  color: ${({ theme }) => theme.colors?.text?.primary || '#18181b'};
  margin: 0;
  flex: 1;
  font-size: ${({ theme }) => theme.typography?.fontSize?.xl || '20px'};
`;

const ProjectStatus = styled.span`
  padding: ${({ theme }) => theme.spacing?.(1) || '4px'} ${({ theme }) => theme.spacing?.(2) || '8px'};
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs || '12px'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.medium || '500'};
  background-color: ${({ status, theme }) => 
    status === 'completed' ? theme.colors?.success?.[100] || '#dcfce7' : 
    status === 'archived' ? theme.colors?.secondary?.[100] || '#f3e8ff' : 
    theme.colors?.primary?.[100] || '#e0f2fd'
  };
  color: ${({ status, theme }) => 
    status === 'completed' ? theme.colors?.success?.[800] || '#166534' : 
    status === 'archived' ? theme.colors?.secondary?.[800] || '#6b21a8' : 
    theme.colors?.primary?.[800] || '#075985'
  };
`;

const ProjectDescription = styled.p`
  color: ${({ theme }) => theme.colors?.text?.secondary || '#52525b'};
  margin-bottom: ${({ theme }) => theme.spacing?.(3) || '12px'};
  line-height: 1.6;
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing?.(3) || '12px'};
  padding-top: ${({ theme }) => theme.spacing?.(3) || '12px'};
  border-top: 1px solid ${({ theme }) => theme.colors?.border?.light || '#e4e4e7'};
`;

const ProjectDate = styled.span`
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm || '14px'};
  color: ${({ theme }) => theme.colors?.text?.secondary || '#52525b'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.(1) || '4px'};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing?.(1) || '4px'};
  border-radius: ${({ theme }) => theme.borderRadius?.md || '8px'};
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.text?.secondary || '#52525b'};
  transition: color 0.2s;

  &:hover {
    color: ${({ variant, theme }) => 
      variant === 'delete' ? theme.colors?.error?.main || '#ef4444' : theme.colors?.primary?.main || '#0ea5e9'
    };
    background: ${({ theme }) => theme.colors?.background?.subtle || '#f4f4f5'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing?.(12) || '48px'};
  color: ${({ theme }) => theme.colors?.text?.secondary || '#52525b'};
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors?.error?.[50] || '#fef2f2'};
  color: ${({ theme }) => theme.colors?.error?.[700] || '#b91c1c'};
  padding: ${({ theme }) => theme.spacing?.(3) || '12px'};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || '12px'};
  margin-bottom: ${({ theme }) => theme.spacing?.(4) || '16px'};
  border-left: 4px solid ${({ theme }) => theme.colors?.error?.[500] || '#ef4444'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.(2) || '8px'};
`;

const CreateButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.(2) || '8px'};
`;

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { items: projects, loading, error } = useSelector(state => state.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async (projectId, projectName) => {
    if (window.confirm(`Вы уверены, что хотите удалить проект "${projectName}"?`)) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
      } catch (error) {
        console.error('Ошибка при удалении проекта:', error);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      active: 'Активный',
      completed: 'Завершен',
      archived: 'Архивный'
    };
    return statusLabels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading && projects.length === 0) {
    return (
      <PageContainer>
        <Loader />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Мои проекты</PageTitle>
        <CreateButton 
          variant="primary" 
          onClick={handleCreateProject}
        >
          <span>+</span>
          Новый проект
        </CreateButton>
      </PageHeader>

      {error && (
        <ErrorMessage>
          <span>⚠️</span>
          Ошибка при загрузке проектов: {error}
        </ErrorMessage>
      )}

      {projects.length === 0 ? (
        <EmptyState>
          <h3>Проектов пока нет</h3>
          <p>Создайте свой первый проект, чтобы начать отслеживать время</p>
          <Button 
            variant="primary" 
            onClick={handleCreateProject}
            style={{ marginTop: '16px' }}
          >
            Создать проект
          </Button>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id || project._id} color={project.color}>
              <ProjectHeader>
                <ProjectName>{project.name}</ProjectName>
                <ProjectStatus status={project.status}>
                  {getStatusLabel(project.status)}
                </ProjectStatus>
              </ProjectHeader>

              {project.description && (
                <ProjectDescription>{project.description}</ProjectDescription>
              )}

              <ProjectMeta>
                <ProjectDate>
                  Создан: {formatDate(project.createdAt || project.created)}
                </ProjectDate>
                <ActionButtons>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(project);
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </ActionButton>
                  <ActionButton
                    variant="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id || project._id, project.name);
                    }}
                    title="Удалить"
                  >
                    🗑️
                  </ActionButton>
                </ActionButtons>
              </ProjectMeta>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}

      <ProjectForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        project={editingProject}
      />
    </PageContainer>
  );
};

export default ProjectsPage;