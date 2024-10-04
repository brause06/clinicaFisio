import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchEjercicios = createAsyncThunk(
  'ejercicios/fetchEjercicios',
  async (clienteId) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/fisioterapeuta/ejercicios/${clienteId}`);
    return response.data;
  }
);

export const createEjercicio = createAsyncThunk(
  'ejercicios/createEjercicio',
  async ({ clienteId, ejercicio }) => {
    const response = await api.post(`/fisioterapeuta/asignar-ejercicio/${clienteId}`, { ejercicioId: ejercicio.id });
    return response.data;
  }
);

export const updateEjercicio = createAsyncThunk(
  'ejercicios/updateEjercicio',
  async ({ ejercicioId, ejercicio }) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/fisioterapeuta/ejercicios/${ejercicioId}`, ejercicio, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const deleteEjercicio = createAsyncThunk(
  'ejercicios/deleteEjercicio',
  async ({ clienteId, ejercicioId }) => {
    await api.delete(`/fisioterapeuta/ejercicios/${clienteId}/${ejercicioId}`);
    return ejercicioId;
  }
);

export const fetchEjerciciosPreCargados = createAsyncThunk(
  'ejercicios/fetchEjerciciosPreCargados',
  async () => {
    const response = await api.get('/fisioterapeuta/ejercicios-precargados');
    return response.data;
  }
);

const ejercicioSlice = createSlice({
  name: 'ejercicios',
  initialState: {
    list: [],
    ejerciciosPreCargados: [],
    status: 'idle',
    error: null
  },
  reducers: {
    agregarEjercicio: (state, action) => {
      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEjercicios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEjercicios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.ejerciciosAsignados;
        state.ejerciciosPreCargados = action.payload.ejerciciosPreCargados;
      })
      .addCase(fetchEjercicios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEjercicio.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEjercicio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (!Array.isArray(state.list)) {
          state.list = [];
        }
        state.list.push(action.payload);
      })
      .addCase(createEjercicio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEjercicio.fulfilled, (state, action) => {
        if (Array.isArray(state.list)) {
          const index = state.list.findIndex(ejercicio => ejercicio.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        }
      })
      .addCase(deleteEjercicio.fulfilled, (state, action) => {
        if (Array.isArray(state.list)) {
          state.list = state.list.filter(ejercicio => ejercicio.id !== action.payload);
        }
      })
      .addCase(fetchEjerciciosPreCargados.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEjerciciosPreCargados.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ejerciciosPreCargados = action.payload;
      })
      .addCase(fetchEjerciciosPreCargados.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default ejercicioSlice.reducer;
