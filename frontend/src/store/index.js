import { configureStore } from '@reduxjs/toolkit';
import clientesReducer from './clienteSlice';
import ejerciciosReducer from './ejercicioSlice';
import citasReducer from './citasSlice';

export const store = configureStore({
  reducer: {
    clientes: clientesReducer,
    ejercicios: ejerciciosReducer,
    citas: citasReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
