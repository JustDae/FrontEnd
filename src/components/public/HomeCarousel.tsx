import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const items = [
  {
    name: "Especialidad de la Casa",
    description: "Prueba nuestro lomo saltado con el toque secreto del chef.",
    image: "/images/plato1.png",
    link: "/menu"
  },
  {
    name: "Postres Irresistibles",
    description: "El final dulce perfecto para tu comida.",
    image: "/images/plato2.png",
    link: "/menu"
  }
];

export function HomeCarousel() {
  const brandColor = '#F55345';

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto',
      position: 'relative',
      overflow: 'hidden',
      '& .swiper-pagination-bullet': {
        backgroundColor: '#ccc',
        opacity: 0.6,
      },
      '& .swiper-pagination-bullet-active': {
        backgroundColor: brandColor,
        width: '20px', 
        borderRadius: '4px',
        transition: 'width 0.3s',
        opacity: 1
      }
    }}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        style={{ width: '100%', paddingBottom: '40px' }}
      >
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <Item item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

function Item({ item }: any) {
  const navigate = useNavigate();
  const brandColor = '#F55345';

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        height: { xs: '300px', md: '400px' },
        borderRadius: '24px',
        overflow: 'hidden',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
      }}
    >
      <Box
        component="img"
        src={item.image}
        alt={item.name}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.6)'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: '10%', md: '8%' },
          transform: 'translateY(-50%)',
          color: 'white',
          width: '80%',
          maxWidth: '500px',
          textAlign: 'left',
          zIndex: 10
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            textShadow: '0 4px 10px rgba(0,0,0,0.3)',
            lineHeight: 1.2
          }}
        >
          {item.name}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            opacity: 0.9, 
            fontSize: { xs: '0.875rem', md: '1.1rem' },
            textShadow: '0 2px 5px rgba(0,0,0,0.3)',
            fontWeight: 400
          }}
        >
          {item.description}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(item.link)}
          sx={{
            bgcolor: brandColor,
            fontWeight: 700,
            borderRadius: '12px',
            textTransform: 'none',
            px: 4,
            py: 1,
            fontSize: '0.9rem',
            boxShadow: `0 8px 20px ${brandColor}44`,
            '&:hover': { 
              bgcolor: '#d44336',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Ver Menú
        </Button> 
      </Box>
    </Paper>
  );
}