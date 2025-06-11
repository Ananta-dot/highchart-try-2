import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const HomePage = () => {
  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '80px' }}>
      <Typography variant="h2" component="h1" gutterBottom style={{ fontWeight: 700, color: '#1a237e' }}>
        Landing Page
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Your single destination for real-time stock analysis. Search, track, and analyze your favorite stocks with our intuitive dashboard.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/dashboard"
        size="large"
        style={{ marginTop: '20px', padding: '10px 30px', fontSize: '1.1rem' }}
      >
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default HomePage;
