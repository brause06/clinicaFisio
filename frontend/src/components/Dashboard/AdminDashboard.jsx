import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Box, Grid } from '@mui/material';
import Citas from '../Citas';

function AdminDashboard() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [allCitas, setAllCitas] = useState([]);

  useEffect(() => {
    fetchClientes();
    fetchAllCitas();
  }, []);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const fetchAllCitas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/citas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllCitas(response.data);
    } catch (error) {
      console.error('Error al obtener todas las citas:', error);
    }
  };

  const handleClienteSelect = (cliente) => {
    setSelectedCliente(cliente);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Administrador
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Lista de Clientes
          </Typography>
          <List>
            {clientes.map((cliente) => (
              <ListItem 
                button 
                key={cliente.id} 
                onClick={() => handleClienteSelect(cliente)}
                selected={selectedCliente && selectedCliente.id === cliente.id}
              >
                <ListItemText primary={`${cliente.nombre} ${cliente.apellido}`} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedCliente ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Citas de {selectedCliente.nombre} {selectedCliente.apellido}
              </Typography>
              <Citas clienteId={selectedCliente.id} isAdmin={true} />
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Todas las Citas
              </Typography>
              <Citas isAdmin={true} allCitas={allCitas} />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
