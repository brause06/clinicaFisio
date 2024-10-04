import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ClienteDashboard from './components/Dashboard/ClienteDashboard';
import FisioterapeutaDashboard from './components/Dashboard/FisioterapeutaDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PrivateRoute from './PrivateRoute'; // Añade esta línea al principio del archivo

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/cliente" 
                element={
                  <PrivateRoute>
                    <ClienteDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/fisioterapeuta" 
                element={
                  <PrivateRoute>
                    <FisioterapeutaDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
            <ToastContainer />
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
