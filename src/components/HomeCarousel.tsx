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
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      overflow: 'hidden',
      '& .swiper-pagination-bullet': {
        backgroundColor: '#fff',
        opacity: 0.5,
      },
      '& .swiper-pagination-bullet-active': {
        backgroundColor: brandColor,
        width: '30px', 
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
        style={{ width: '100%' }}
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
        height: { xs: '500px', md: '700px' },
        borderRadius: 0,
        overflow: 'hidden',
        width: '100%'
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
          filter: 'brightness(0.5)'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          width: '90%',
          maxWidth: '1000px',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 950,
            mb: 2,
            fontSize: { xs: '2.5rem', md: '5rem' },
            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            letterSpacing: '-2px',
            lineHeight: 1
          }}
        >
          {item.name}
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 6, 
            opacity: 0.9, 
            fontSize: { xs: '1.1rem', md: '1.8rem' },
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontWeight: 400,
            maxWidth: '700px',
            mx: 'auto'
          }}
        >
          {item.description}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(item.link)}
          sx={{
            bgcolor: brandColor,
            fontWeight: 900,
            borderRadius: '50px',
            textTransform: 'none',
            px: { xs: 4, md: 8 },
            py: { xs: 1.5, md: 2.5 },
            fontSize: { xs: '1rem', md: '1.2rem' },
            boxShadow: `0 15px 35px ${brandColor}55`,
            '&:hover': { 
              bgcolor: '#d44336',
              transform: 'translateY(-5px)',
              boxShadow: `0 20px 45px ${brandColor}77`,
            },
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          Explorar Menú
        </Button> 
      </Box>
    </Paper>
  );
}