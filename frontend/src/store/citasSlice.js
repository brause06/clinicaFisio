import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCitas = createAsyncThunk(
  'citas/fetchCitas',
  async (clienteId) => {
    const response = await api.get(`/fisioterapeuta/citas/${clienteId}`);
    return response.data;
  }
);

export const createCita = createAsyncThunk(
  'citas/createCita',
  async ({ clienteId, cita }) => {
    const response = await api.post(`/fisioterapeuta/citas/${clienteId}`, cita);
    return response.data;
  }
);

export const updateCita = createAsyncThunk(
  'citas/updateCita',
  async ({ citaId, cita }) => {
    const response = await api.put(`/fisioterapeuta/citas/${citaId}`, cita);
    return response.data;
  }
);

export const deleteCita = createAsyncThunk(
  'citas/deleteCita',
  async (citaId) => {
    await api.delete(`/fisioterapeuta/citas/${citaId}`);
    return citaId;
  }
);

const citasSlice = createSlice({
  name: 'citas',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCitas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCitas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCita.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCita.fulfilled, (state, action) => {
        const index = state.list.findIndex(cita => cita.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteCita.fulfilled, (state, action) => {
        state.list = state.list.filter(cita => cita.id !== action.payload);
      });
  }
});

export default citasSlice.reducer;
