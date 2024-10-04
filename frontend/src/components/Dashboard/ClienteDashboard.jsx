import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, Tabs, Tab, 
  List, ListItem, ListItemText, Checkbox, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, CardMedia
} from '@mui/material';
import axios from 'axios';
import Citas from '../Citas';
import EjerciciosChart from '../Fisioterapeuta/EjerciciosChart';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ClienteDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [ejercicios, setEjercicios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');
  const clienteId = localStorage.getItem('userId');

  useEffect(() => {
    fetchEjercicios();
    fetchHistorial();
  }, []);

  const fetchEjercicios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/cliente/ejercicios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Ejercicios recibidos (detallado):', JSON.stringify(response.data, null, 2));
      setEjercicios(response.data.filter(ejercicio => !ejercicio.realizado));
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
    }
  };

  const fetchHistorial = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/cliente/historial`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorial(response.data);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const marcarComoRealizado = async (ejercicioId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5001/api/cliente/ejercicios/${ejercicioId}/realizado`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEjercicios();
      fetchHistorial();
    } catch (error) {
      console.error('Error al marcar ejercicio como realizado:', error);
    }
  };

  const handleOpenVideo = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setOpenDialog(true);
  };

  const handleCloseVideo = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Cliente
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="client dashboard tabs">
                  <Tab label="Ejercicios Asignados" />
                  <Tab label="Historial de Ejercicios" />
                  <Tab label="Citas" />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>Ejercicios Asignados</Typography>
                {ejercicios.length > 0 ? (
                  <List>
                    {ejercicios.map((ejercicio) => {
                      console.log('Renderizando ejercicio:', ejercicio);
                      return (
                        <Card key={ejercicio.id} sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6">{ejercicio.nombre}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {ejercicio.descripcion}
                            </Typography>
                            {ejercicio.fotoUrl ? (
                              <CardMedia
                                component="img"
                                height="140"
                                image={ejercicio.fotoUrl}
                                alt={ejercicio.nombre}
                                sx={{ objectFit: 'contain', mt: 2 }}
                              />
                            ) : (
                              <Typography>No hay foto disponible</Typography>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              {ejercicio.videoUrl ? (
                                <Button 
                                  startIcon={<PlayCircleOutlineIcon />}
                                  onClick={() => handleOpenVideo(ejercicio.videoUrl)}
                                >
                                  Ver Video
                                </Button>
                              ) : (
                                <Typography>No hay video disponible</Typography>
                              )}
                              <Checkbox
                                checked={ejercicio.realizado}
                                onChange={() => marcarComoRealizado(ejercicio.id)}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </List>
                ) : (
                  <Typography>No tienes ejercicios asignados actualmente.</Typography>
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>Historial de Ejercicios</Typography>
                {historial.length > 0 ? (
                  <List>
                    {historial.map((entrada, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`Ejercicio: ${entrada.Ejercicio?.nombre || 'Nombre no disponible'}`}
                          secondary={`Fecha: ${new Date(entrada.fecha).toLocaleDateString()} - ${new Date(entrada.fecha).toLocaleTimeString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>No hay ejercicios en el historial.</Typography>
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Citas clienteId={clienteId} isFisioterapeuta={false} />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseVideo} maxWidth="md" fullWidth>
        <DialogTitle>Video del Ejercicio</DialogTitle>
        <DialogContent>
          <iframe
            width="100%"
            height="315"
            src={selectedVideo}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideo}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ClienteDashboard;