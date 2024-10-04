import React from 'react';
import { Typography, Box, Container, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Footer from '../components/Footer';
import Carrousel from '../components/Carrousel';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(10, 0),
  textAlign: 'center',
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.light,
  },
}));

function Home() {
  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenido a nuestra Clínica de Fisioterapia
          </Typography>
          <Typography variant="h5" paragraph>
            Cuidamos de tu salud y bienestar con profesionalismo y dedicación
          </Typography>
          <StyledButton variant="contained" size="large">
            Reserva tu cita
          </StyledButton>
        </Container>
      </HeroSection>

      <ContentSection>
        <Container maxWidth="lg">
          <Carrousel />
          
          <Typography variant="h4" gutterBottom align="center" sx={{ mt: 6, mb: 4, color: 'primary.main' }}>
            Nuestros Servicios
          </Typography>
          
          <Grid container spacing={4}>
            {['Fisioterapia Deportiva', 'Rehabilitación', 'Terapia Manual', 'Electroterapia'].map((service) => (
              <Grid item xs={12} sm={6} md={3} key={service}>
                <StyledPaper elevation={2}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {service}
                  </Typography>
                  <Typography variant="body2">
                    Ofrecemos {service} de alta calidad con profesionales expertos.
                  </Typography>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="body1" sx={{ mt: 6, textAlign: 'center', maxWidth: '800px', margin: 'auto' }}>
            Nuestra clínica ofrece servicios de fisioterapia de alta calidad con un equipo de profesionales altamente calificados.
            Utilizamos las técnicas más avanzadas y equipos de última generación para garantizar la mejor atención a nuestros pacientes.
          </Typography>
        </Container>
      </ContentSection>

      <Footer />
    </Box>
  );
}

export default Home;
