import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box, MenuItem } from '@mui/material';
import { register } from '../../services/auth';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email es requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
  nombre: Yup.string().required('Nombre es requerido'),
  apellido: Yup.string().required('Apellido es requerido'),
  role: Yup.string().required('Rol es requerido')
});

function Register() {
  const navigate = useNavigate();

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
          Registro
        </Typography>
        <Formik
          initialValues={{ email: '', password: '', nombre: '', apellido: '', role: 'cliente' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await register(values);
              navigate('/');
            } catch (error) {
              console.error('Error de registro', error);
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                error={touched.password && errors.password}
                helperText={touched.password && errors.password}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre"
                name="nombre"
                error={touched.nombre && errors.nombre}
                helperText={touched.nombre && errors.nombre}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="apellido"
                label="Apellido"
                name="apellido"
                error={touched.apellido && errors.apellido}
                helperText={touched.apellido && errors.apellido}
              />
              <Field
                as={TextField}
                select
                margin="normal"
                required
                fullWidth
                id="role"
                label="Rol"
                name="role"
                error={touched.role && errors.role}
                helperText={touched.role && errors.role}
              >
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="fisioterapeuta">Fisioterapeuta</MenuItem>
              </Field>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Registrarse
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Register;
