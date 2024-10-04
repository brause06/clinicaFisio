import React from 'react';
import { Box, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

function Carrousel() {
  const carouselItems = [
    { 
      img: `${process.env.PUBLIC_URL}/clinica1.jpg`,
      description: 'Nuestras modernas instalaciones'
    },
    { 
      img: `${process.env.PUBLIC_URL}/clinica2.jpg`, 
      description: 'Equipo de última generación' 
    },
    // Puedes agregar más imágenes aquí
  ];

  return (
    <Carousel>
      {carouselItems.map((item, index) => (
        <Box 
          key={index} 
          sx={{ 
            height: 400, 
            position: 'relative',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }
          }}
        >
          <img 
            src={item.img} 
            alt={item.description} 
            onError={(e) => {
              console.error(`Error loading image: ${item.img}`);
              e.target.src = `${process.env.PUBLIC_URL}/placeholder.jpg`; // Una imagen de placeholder
            }}
          />
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: 2,
            }}
          >
            {item.description}
          </Typography>
        </Box>
      ))}
    </Carousel>
  );
}

export default Carrousel;