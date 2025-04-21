import React, { useEffect, useState } from 'react';
import { 
  Button,
  CircularProgress, 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TablePagination,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import ProjectForm from '../../components/Projects/ProjectForm';
import { fetchProjects, deleteProject } from '../../store/slices/projectsSlice';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.projects);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && !items.length) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4">Все проекты</Typography>
        <Button
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
          variant="contained"
        >
          Создать
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Цвет</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{
                        display: 'inline-block',
                        width: 20,
                        height: 20,
                        backgroundColor: project.color,
                        borderRadius: '50%'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="edit"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Удалить проект "${project.name}"?`)) {
                          dispatch(deleteProject(project.id));
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Проектов на странице:"
        sx={{ mt: 2 }}
      />

      <ProjectForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
      />
    </Box>
  );
};

export default ProjectsPage;