import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            © {new Date().getFullYear()} Clínica de Fisioterapia. Todos los derechos reservados.
          </Typography>
          <Box>
            <IconButton color="inherit" href="https://www.facebook.com/ReactivaRd/?locale=es_LA" target="_blank" rel="noopener noreferrer">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" href="https://www.instagram.com/reactivard/" target="_blank" rel="noopener noreferrer">
              <Instagram />
            </IconButton>
            <IconButton color="inherit" href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <Twitter />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
