import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination
} from '@mui/material';
import { useSelector } from 'react-redux';

const RecentTimeEntries = () => {
  const { entries, loading } = useSelector((state) => ({
    entries: state.timeEntries?.entries || [],
    loading: state.timeEntries?.loading || false
  }));

  const { items: projects = [] } = useSelector((state) => state.projects || {});

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatHours = (seconds) => (seconds / 3600).toFixed(1);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Проект</TableCell>
              <TableCell align="right">Затраченное время</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => {
                const time = entries
                  .filter(e => e.projectId === project.id)
                  .reduce((sum, e) => sum + (e.duration || 0), 0);
                
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{                             
                          width: 16, 
                          height: 16, 
                          bgcolor: project.color, 
                          mr: 2,
                          borderRadius: '50%' 
                        }} />
                        {project.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatHours(time)} ч</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={projects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Проектов на странице:"
      />
    </Paper>
  );
};

export default RecentTimeEntries;