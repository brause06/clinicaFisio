import React, { useState, useEffect, useCallback, lazy, Suspense, memo } from 'react';
import axios from 'axios';
import { 
  Container, Typography, TextField, List, ListItem, ListItemText, 
  Button, Box, Tabs, Tab, Dialog, DialogTitle, DialogContent, 
  DialogActions, FormControl, InputLabel, Select, MenuItem, Pagination, Paper, Grid, Card, CardContent, IconButton, CircularProgress, Divider, Chip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Citas from '../Citas';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FixedSizeList as List2 } from 'react-window';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientes, setSelectedClienteAction } from '../../store/clienteSlice';
import { 
  fetchEjercicios, 
  createEjercicio, 
  updateEjercicio, 
  deleteEjercicio, 
  fetchEjerciciosPreCargados 
} from '../../store/ejercicioSlice';
import api from '../../services/api';

const EjerciciosChart = lazy(() => import('../Fisioterapeuta/EjerciciosChart'));

function FisioterapeutaDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: '',
    descripcion: '',
    foto: null,
    videoUrl: ''
  });
  const [editandoEjercicio, setEditandoEjercicio] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevaCita, setNuevaCita] = useState(dayjs());
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState([]);
  const [page, setPage] = useState(1);
  const [clientesPorPagina] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  const dispatch = useDispatch();
  const clientes = useSelector(state => state.clientes.list);
  const selectedCliente = useSelector(state => state.clientes.selectedCliente);
  const ejercicios = useSelector(state => state.ejercicios.list);
  const ejerciciosStatus = useSelector(state => state.ejercicios.status);
  const ejerciciosError = useSelector(state => state.ejercicios.error);
  const ejerciciosPreCargados = useSelector(state => state.ejercicios.ejerciciosPreCargados);
  const ejerciciosPreCargadosStatus = useSelector(state => state.ejercicios.status);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token en FisioterapeutaDashboard antes de fetchClientes:', token);
    if (token) {
      dispatch(fetchClientes());
      dispatch(fetchEjerciciosPreCargados());
    } else {
      console.log('No hay token en FisioterapeutaDashboard');
    }
  }, [dispatch]);

  const handleClienteSelect = useCallback((cliente) => {
    if (cliente && cliente.id) {
      dispatch(setSelectedClienteAction(cliente));
      dispatch(fetchEjercicios(cliente.id));
    } else {
      console.error('Cliente inválido seleccionado:', cliente);
    }
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setNuevoEjercicio(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setNuevoEjercicio(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAgregarEjercicio = async (e) => {
    e.preventDefault();
    if (!selectedCliente) {
      alert('Por favor, seleccione un cliente primero');
      return;
    }
    try {
      const ejercicioData = {
        nombre: nuevoEjercicio.nombre,
        descripcion: nuevoEjercicio.descripcion,
        fotoUrl: nuevoEjercicio.foto ? URL.createObjectURL(nuevoEjercicio.foto) : null,
        videoUrl: nuevoEjercicio.videoUrl
      };

      const resultAction = await dispatch(createEjercicio({ clienteId: selectedCliente.id, ejercicio: ejercicioData }));
      if (createEjercicio.fulfilled.match(resultAction)) {
        console.log('Ejercicio agregado con éxito:', resultAction.payload);
        setNuevoEjercicio({ nombre: '', descripcion: '', foto: null, videoUrl: '' });
      } else {
        console.error('Error al agregar ejercicio:', resultAction.error);
        alert('Error al agregar ejercicio: ' + resultAction.error.message);
      }
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
      alert('Error al agregar ejercicio: ' + error.message);
    }
  };

  const handleEditarEjercicio = async () => {
    try {
      await dispatch(updateEjercicio({ clienteId: selectedCliente.id, ejercicioId: editandoEjercicio.id, ejercicio: editandoEjercicio }));
      setEditandoEjercicio(null);
    } catch (error) {
      console.error('Error al editar ejercicio:', error);
    }
  };

  const handleNuevaCita = async () => {
    try {
      // Aquí deberías usar una acción de Redux para crear una nueva cita
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5001/api/fisioterapeuta/citas/${selectedCliente.id}`, 
        { fecha: nuevaCita.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al crear nueva cita', error);
    }
  };

  const handleBorrarEjercicio = async (ejercicioId) => {
    try {
      await dispatch(deleteEjercicio({ clienteId: selectedCliente.id, ejercicioId }));
    } catch (error) {
      console.error('Error al borrar ejercicio', error);
    }
  };

  const indexDelUltimoCliente = page * clientesPorPagina;
  const indexDelPrimerCliente = indexDelUltimoCliente - clientesPorPagina;
  const clientesActuales = clientes.slice(indexDelPrimerCliente, indexDelUltimoCliente);

  const cambiarPagina = (evento, valor) => {
    setPage(valor);
  };

  const handleAgregarEjercicioPreCargado = async (ejercicio) => {
    if (!selectedCliente || !selectedCliente.id) {
      alert('Por favor, seleccione un cliente válido primero');
      return;
    }
    try {
      const resultAction = await dispatch(createEjercicio({ clienteId: selectedCliente.id, ejercicio }));
      if (createEjercicio.fulfilled.match(resultAction)) {
        console.log('Ejercicio asignado con éxito:', resultAction.payload);
        // Actualiza la lista de ejercicios asignados
        dispatch(fetchEjercicios(selectedCliente.id));
      } else {
        console.error('Error al asignar ejercicio:', resultAction.error);
        alert('Error al asignar ejercicio: ' + resultAction.error.message);
      }
    } catch (error) {
      console.error('Error al asignar ejercicio:', error);
      alert('Error al asignar ejercicio: ' + error.message);
    }
  };

  useEffect(() => {
    if (selectedCliente) {
      dispatch(fetchEjercicios(selectedCliente.id));
    }
  }, [selectedCliente, dispatch]);

  const ClienteRow = memo(({ index, style }) => {
    const cliente = clientes[index];
    return (
      <ListItem 
        style={style}
        button 
        key={cliente.id} 
        onClick={() => handleClienteSelect(cliente)}
        selected={selectedCliente && selectedCliente.id === cliente.id}
      >
        <PersonIcon sx={{ mr: 2 }} />
        <ListItemText primary={`${cliente.nombre} ${cliente.apellido}`} />
      </ListItem>
    );
  });

  const handleAsignarEjercicio = async (ejercicio) => {
    try {
      await dispatch(createEjercicio({ clienteId: selectedCliente.id, ejercicio })).unwrap();
      // Manejar éxito, por ejemplo:
      // setSnackbar({ open: true, message: 'Ejercicio asignado con éxito', severity: 'success' });
    } catch (error) {
      console.error('Error al asignar ejercicio:', error);
      // Manejar error, por ejemplo:
      // setSnackbar({ open: true, message: 'Error al asignar ejercicio', severity: 'error' });
    }
  };

  const handleDeleteEjercicio = (ejercicio) => {
    if (selectedCliente) {
      dispatch(deleteEjercicio({ clienteId: selectedCliente.id, ejercicioId: ejercicio.id }));
    } else {
      console.error('No hay cliente seleccionado');
    }
  };

  const fetchHistorial = async (clienteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/fisioterapeuta/historial/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistorial(response.data);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  useEffect(() => {
    if (selectedCliente) {
      fetchHistorial(selectedCliente.id);
    }
  }, [selectedCliente]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ my: 4 }}>
        Panel de Fisioterapeuta
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                fullWidth
                label="Buscar cliente"
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <List2
              height={400}
              itemCount={clientes.length}
              itemSize={50}
              width={300}
            >
              {ClienteRow}
            </List2>
            <Pagination 
              count={Math.ceil(clientes.length / clientesPorPagina)} 
              page={page} 
              onChange={cambiarPagina}
              sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedCliente && (
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {selectedCliente.nombre} {selectedCliente.apellido}
                </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Ejercicios" />
                    <Tab label="Historial" />
                    <Tab label="Citas" />
                  </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                  <Typography variant="h6" gutterBottom>Ejercicios Asignados</Typography>
                  {ejerciciosStatus === 'loading' ? (
                    <CircularProgress />
                  ) : ejercicios && ejercicios.length > 0 ? (
                    <List>
                      {ejercicios.map((ejercicio) => (
                        <ListItem key={ejercicio.id}>
                          <ListItemText 
                            primary={ejercicio.nombre} 
                            secondary={ejercicio.descripcion}
                          />
                          {ejercicio.realizado ? (
                            <Chip label="Realizado" color="success" />
                          ) : (
                            <Chip label="Pendiente" color="warning" />
                          )}
                          {editandoEjercicio && editandoEjercicio.id === ejercicio.id ? (
                            <>
                              <TextField
                                value={editandoEjercicio.nombre}
                                onChange={(e) => setEditandoEjercicio({...editandoEjercicio, nombre: e.target.value})}
                              />
                              <TextField
                                value={editandoEjercicio.descripcion}
                                onChange={(e) => setEditandoEjercicio({...editandoEjercicio, descripcion: e.target.value})}
                              />
                              <Button onClick={handleEditarEjercicio}>Guardar</Button>
                              <Button onClick={() => setEditandoEjercicio(null)}>Cancelar</Button>
                            </>
                          ) : (
                            <>
                              <IconButton onClick={() => setEditandoEjercicio(ejercicio)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDeleteEjercicio(ejercicio)}>
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No hay ejercicios asignados.</Typography>
                  )}

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Box component="form" onSubmit={handleAgregarEjercicio}>
                      <TextField
                        name="nombre"
                        label="Nombre del ejercicio"
                        value={nuevoEjercicio.nombre}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        name="descripcion"
                        label="Descripción"
                        value={nuevoEjercicio.descripcion}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                      />
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="foto-file"
                        type="file"
                        name="foto"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="foto-file">
                        <Button variant="contained" component="span">
                          Subir Foto
                        </Button>
                      </label>
                      {nuevoEjercicio.foto && <Typography>{nuevoEjercicio.foto.name}</Typography>}
                      <TextField
                        name="videoUrl"
                        label="URL del video"
                        value={nuevoEjercicio.videoUrl}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                      <Button type="submit" variant="contained" color="primary">
                        Agregar Ejercicio
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>Ejercicios Precargados</Typography>
                  {ejerciciosPreCargadosStatus === 'loading' ? (
                    <CircularProgress />
                  ) : Array.isArray(ejerciciosPreCargados) && ejerciciosPreCargados.length > 0 ? (
                    <List>
                      {ejerciciosPreCargados.map((ejercicio) => (
                        <ListItem key={ejercicio.id}>
                          <ListItemText 
                            primary={ejercicio.nombre} 
                            secondary={ejercicio.descripcion}
                          />
                          {ejercicio.fotoUrl && (
                            <img 
                              src={ejercicio.fotoUrl} 
                              alt={ejercicio.nombre} 
                              style={{width: 50, height: 50, marginRight: 10, objectFit: 'cover'}} 
                            />
                          )}
                          {ejercicio.videoUrl && (
                            <Button 
                              onClick={() => window.open(ejercicio.videoUrl)} 
                              variant="outlined" 
                              size="small"
                            >
                              Ver Video
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleAgregarEjercicioPreCargado(ejercicio)} 
                            variant="contained" 
                            sx={{ ml: 1 }}
                          >
                            Agregar al Cliente
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No hay ejercicios precargados disponibles.</Typography>
                  )}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <Typography variant="h6" gutterBottom>Historial de Ejercicios</Typography>
                  {historial.length > 0 ? (
                    <List>
                      {historial.map((entrada) => (
                        <ListItem key={entrada.id}>
                          <ListItemText
                            primary={entrada.Ejercicio?.nombre || 'Ejercicio no disponible'}
                            secondary={`Realizado el: ${new Date(entrada.fecha).toLocaleString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No hay ejercicios en el historial.</Typography>
                  )}
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <Citas clienteId={selectedCliente?.id} isFisioterapeuta={true} />
                </TabPanel>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default FisioterapeutaDashboard;