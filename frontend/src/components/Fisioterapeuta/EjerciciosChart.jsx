import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EjerciciosChart = ({ clienteId }) => {
	const [progresoEjercicios, setProgresoEjercicios] = useState([]);

	useEffect(() => {
		const fetchProgresoEjercicios = async () => {
			if (!clienteId) return;
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`http://localhost:5001/api/cliente/ejercicios/progreso`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				setProgresoEjercicios(response.data);
			} catch (error) {
				console.error('Error al obtener progreso de ejercicios:', error.response?.data || error.message);
				setProgresoEjercicios([]);
			}
		};

		fetchProgresoEjercicios();
	}, [clienteId]);

	if (progresoEjercicios.length === 0) {
		return <Typography>No hay datos de progreso disponibles.</Typography>;
	}

	const data = {
		labels: progresoEjercicios.map(ej => ej.nombre),
		datasets: [
			{
				label: 'Ejercicios Asignados',
				data: progresoEjercicios.map(ej => ej.asignados),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
			},
			{
				label: 'Ejercicios Realizados',
				data: progresoEjercicios.map(ej => ej.realizados),
				backgroundColor: 'rgba(153, 102, 255, 0.6)',
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Progreso de Ejercicios',
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Cantidad'
				}
			}
		}
	};

	return <Bar data={data} options={options} />;
};

export default EjerciciosChart;

