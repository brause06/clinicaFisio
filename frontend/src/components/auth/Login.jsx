import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { login } from '../../services/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      console.log('Login successful:', data);
      
      if (data.token && data.usuario && data.usuario.role) {
        console.log('Token recibido:', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.usuario.id);
        localStorage.setItem('userRole', data.usuario.role);
        
        console.log('Token guardado después del login:', localStorage.getItem('token'));
        
        switch(data.usuario.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'fisioterapeuta':
            navigate('/fisioterapeuta');
            break;
          case 'cliente':
            navigate('/cliente');
            break;
          default:
            setError('Rol no reconocido');
            localStorage.clear();
        }
      } else {
        setError('Respuesta del servidor inválida');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        setError(error.response.data.message || 'Error en el servidor');
      } else if (error.request) {
        console.log('Request:', error.request);
        setError('No se pudo conectar con el servidor');
      } else {
        console.log('Error message:', error.message);
        setError('Error desconocido');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
