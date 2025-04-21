const projectsKey = 'mockProjects';

const initializeMockProjects = () => {
  if (!localStorage.getItem(projectsKey)) {
    const initialProjects = [
      { id: 1, name: 'Основной проект', color: '#3b82f6', createdAt: new Date().toISOString() },
      { id: 2, name: 'Дополнительный проект', color: '#10b981', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem(projectsKey, JSON.stringify(initialProjects));
  }
};

const getAll = async () => {
  initializeMockProjects();
  return new Promise((resolve) => {
    setTimeout(() => {
      const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
      resolve(projects);
    }, 300);
  });
};

const create = async (projectData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
      const newProject = {
        id: Date.now(),
        ...projectData,
        createdAt: new Date().toISOString()
      };
      projects.push(newProject);
      localStorage.setItem(projectsKey, JSON.stringify(projects));
      resolve(newProject);
    }, 300);
  });
};

const update = async (id, projectData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
      const index = projects.findIndex(p => p.id === id);
      
      if (index === -1) {
        reject(new Error('Project not found'));
        return;
      }

      const updatedProject = { ...projects[index], ...projectData };
      projects[index] = updatedProject;
      localStorage.setItem(projectsKey, JSON.stringify(projects));
      resolve(updatedProject);
    }, 300);
  });
};

const remove = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        initializeMockProjects();
        const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
        const filtered = projects.filter(p => p.id !== id);
        
        if (projects.length === filtered.length) {
          throw new Error(`Проект с ID ${id} не найден`);
        }

        localStorage.setItem(projectsKey, JSON.stringify(filtered));
        resolve(id);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const mockProjects = {
  getAll,
  create,
  update,
  remove,
};

export default mockProjects;