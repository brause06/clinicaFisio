import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchClientes = createAsyncThunk(
  'clientes/fetchClientes',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Iniciando solicitud para obtener clientes');
      const response = await api.get('/fisioterapeuta/clientes');
      console.log('Respuesta recibida:', response);
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      console.log('Configuración de la solicitud:', error.config);
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

const clientesSlice = createSlice({
  name: 'clientes',
  initialState: {
    list: [],
    selectedCliente: null,
    status: 'idle',
    error: null
  },
  reducers: {
    setSelectedCliente: (state, action) => {
      state.selectedCliente = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setSelectedCliente } = clientesSlice.actions;

export const setSelectedClienteAction = (cliente) => (dispatch) => {
  if (cliente) {
    dispatch(setSelectedCliente(cliente));
  } else {
    console.error('Intento de seleccionar un cliente nulo o indefinido');
  }
};

export default clientesSlice.reducer;
