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
      position: 'relative',
     
      '& .swiper-pagination-bullet': {
        backgroundColor: '#ccc',
        opacity: 1,
      },
      '& .swiper-pagination-bullet-active': {
        backgroundColor: brandColor,
        width: '20px', 
        borderRadius: '4px',
        transition: 'width 0.3s'
      }
    }}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={false} 
        style={{
          paddingBottom: '30px' 
        }}
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
        height: { xs: '350px', md: '500px' },
        borderRadius: '16px',
        overflow: 'hidden',
        mx: { xs: 0, md: 1 },
        mt: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
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
          filter: 'brightness(0.65)' 
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: '5%', md: '8%' },
          transform: 'translateY(-50%)',
          color: 'white',
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
            fontSize: { xs: '1.8rem', md: '3rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {item.name}
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
          {item.description}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(item.link)}
          sx={{
            bgcolor: brandColor,
            fontWeight: 600,
            borderRadius: '10px',
            textTransform: 'none',
            px: 4,
            py: 1.2,
            boxShadow: `0 4px 14px ${brandColor}66`,
            '&:hover': { bgcolor: '#d44336' }
          }}
        >
          Ver Menú
        </Button> 
      </Box>
    </Paper>
  );
}