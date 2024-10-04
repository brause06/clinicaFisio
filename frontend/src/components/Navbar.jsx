import React from 'react';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const url = `${process.env.PUBLIC_URL}/clinicaReactiva1.png`

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/">
              <Box
                component="img"
                src={url}
                alt="Logo"
                sx={{
                  height: 50,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Link>
          </Box>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to={role === 'cliente' ? '/cliente' : '/fisioterapeuta'}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Iniciar sesión
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
