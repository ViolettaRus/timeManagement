import { Box, Container } from '@mui/material';
import Timer from '../../components/Timer/Timer';

const DashboardPage = () => {
  return (
    <Container maxWidth="md" sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: 500,
        }}>
          <Timer />
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;