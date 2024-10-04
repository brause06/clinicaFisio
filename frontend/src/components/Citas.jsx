import React, { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import { Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parse, setHours, setMinutes } from 'date-fns';

const Citas = memo(function Citas({ clienteId, isFisioterapeuta, isAdmin, allCitas }) {
  const [citas, setCitas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ start: new Date(), end: new Date() });
  const [selectedTime, setSelectedTime] = useState('09:00');

  const fetchCitas = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      let url;
      if (isAdmin) {
        url = clienteId 
          ? `http://localhost:5001/api/admin/citas/${clienteId}`
          : 'http://localhost:5001/api/admin/citas';
      } else if (isFisioterapeuta) {
        url = `http://localhost:5001/api/fisioterapeuta/citas/${clienteId}`;
      } else {
        url = 'http://localhost:5001/api/cliente/citas';
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const formattedCitas = response.data.map(cita => ({
        id: cita.id,
        title: cita.Cliente ? `Cita: ${cita.Cliente.nombre} ${cita.Cliente.apellido}` : 'Cita sin nombre',
        start: new Date(cita.fecha),
        end: new Date(new Date(cita.fecha).getTime() + 60*60*1000),
      }));
      setCitas(formattedCitas);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  }, [clienteId, isFisioterapeuta, isAdmin]);

  useEffect(() => {
    if (isAdmin && allCitas) {
      const formattedCitas = allCitas.map(cita => ({
        id: cita.id,
        title: `Cita: ${cita.Cliente.nombre} ${cita.Cliente.apellido}`,
        start: new Date(cita.fecha),
        end: new Date(new Date(cita.fecha).getTime() + 60*60*1000),
      }));
      setCitas(formattedCitas);
    } else {
      fetchCitas();
    }
  }, [fetchCitas, isAdmin, allCitas]);

  const handleDateSelect = (selectInfo) => {
    if (isFisioterapeuta || isAdmin) {
      const selectedDate = new Date(selectInfo.start);
      setNewEvent({
        start: selectedDate,
        end: new Date(selectedDate.getTime() + 60 * 60 * 1000),
      });
      setSelectedTime(format(selectedDate, 'HH:mm'));
      setOpenDialog(true);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (isFisioterapeuta || isAdmin) {
      setSelectedEvent(clickInfo.event);
      setNewEvent({
        start: clickInfo.event.start,
        end: clickInfo.event.end,
      });
      setOpenDialog(true);
    }
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    const [hours, minutes] = event.target.value.split(':');
    const newStart = setHours(setMinutes(newEvent.start, parseInt(minutes)), parseInt(hours));
    setNewEvent({
      ...newEvent,
      start: newStart,
      end: new Date(newStart.getTime() + 60 * 60 * 1000),
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setNewEvent({ start: new Date(), end: new Date() });
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = isAdmin
        ? `http://localhost:5001/api/admin/citas`
        : `http://localhost:5001/api/fisioterapeuta/citas`;
      setOpenDialog(true);
      const citaData = {
        fecha: newEvent.start,
        clienteId: clienteId
      };
    setOpenDialog(false);
      if (selectedEvent) {
        await axios.put(`${url}/${selectedEvent.id}`, citaData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(url, citaData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchCitas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar la cita:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && (isFisioterapeuta || isAdmin)) {
      try {
        const token = localStorage.getItem('token');
        const url = isAdmin
          ? `http://localhost:5001/api/admin/citas/${selectedEvent.id}`
          : `http://localhost:5001/api/fisioterapeuta/citas/${selectedEvent.id}`;
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCitas();
        handleCloseDialog();
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
      }
    }
  };

  return (
    <Box>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={isFisioterapeuta || isAdmin}
        selectable={isFisioterapeuta || isAdmin}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={citas}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height="auto"
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedEvent ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="date"
            label="Fecha"
            type="date"
            fullWidth
            value={format(newEvent.start, 'yyyy-MM-dd')}
            onChange={(e) => {
              const newDate = parse(e.target.value, 'yyyy-MM-dd', new Date());
              setNewEvent({
                ...newEvent,
                start: setHours(setMinutes(newDate, newEvent.start.getMinutes()), newEvent.start.getHours()),
                end: new Date(newDate.getTime() + 60 * 60 * 1000),
              });
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Select
            label="Hora"
            value={selectedTime}
            onChange={handleTimeChange}
            fullWidth
          >
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <MenuItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                {`${hour.toString().padStart(2, '0')}:00`}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          {(isFisioterapeuta || isAdmin) && (
            <>
              <Button onClick={handleSaveEvent} color="primary">
                {selectedEvent ? 'Actualizar' : 'Crear'}
              </Button>
              {selectedEvent && (
                <Button onClick={handleDeleteEvent} color="secondary">
                  Eliminar
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default Citas;