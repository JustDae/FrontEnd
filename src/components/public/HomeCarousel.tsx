import { Box, Typography, Button, Paper, alpha, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';


const items = [
  {
    name: "Especialidad de la Casa",
    description: "Prueba nuestro lomo saltado con el toque secreto del chef.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600",
    link: "/menu"
  },
  {
    name: "Postres Irresistibles",
    description: "El final dulce perfecto para tu comida.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600",
    link: "/menu"
  }
];

export function HomeCarousel() {
  const brandColor = '#F55345';

  return (
    <Box sx={{ 
      width: '100vw',
      height: { xs: '100dvh', md: '100vh' },
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      overflow: 'hidden',
      '& .nav-button': {
        color: 'white',
        bgcolor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        width: { xs: 40, md: 50 },
        height: { xs: 40, md: 50 },
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: brandColor,
          borderColor: brandColor,
          transform: 'translateY(-50%) scale(1.1)',
        },
        display: { xs: 'none', md: 'flex' }
      },
      '& .prev-btn': { left: { xs: 10, md: 30 } },
      '& .next-btn': { right: { xs: 10, md: 30 } },
      '& .swiper-pagination-bullet': {
        backgroundColor: 'rgba(255,255,255,0.5)',
        opacity: 1,
        mb: { xs: 1, md: 3 }
      },
      '& .swiper-pagination-bullet-active': {
        backgroundColor: brandColor,
        width: { xs: '25px', md: '40px' }, 
        borderRadius: '4px',
        transition: 'width 0.3s'
      }
    }}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: '.prev-btn',
          nextEl: '.next-btn',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <Item item={item} />
          </SwiperSlide>
        ))}

        <IconButton className="nav-button prev-btn">
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} />
        </IconButton>
        <IconButton className="nav-button next-btn">
          <ArrowForwardIosIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} />
        </IconButton>
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
        height: '100%',
        width: '100vw',
        borderRadius: 0,
        m: 0,
        p: 0,
        overflow: 'hidden'
      }}
    >
      <Box
        component="img"
        src={item.image}
        alt={item.name}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: {
          xs: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)',
          md: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
        },
        zIndex: 1
      }} />

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: '50%', md: '10%' },
          transform: { xs: 'translate(-50%, -50%)', md: 'translateY(-50%)' },
          color: 'white',
          maxWidth: { xs: '90%', sm: '80%', md: '600px' },
          textAlign: { xs: 'center', md: 'left' },
          zIndex: 10
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            mb: 1,
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            textTransform: 'uppercase',
            letterSpacing: { xs: '-1px', md: '-2px' },
            lineHeight: 1
          }}
        >
          {item.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 4, 
            opacity: 0.8, 
            maxWidth: '450px',
            mx: { xs: 'auto', md: 0 },
            fontSize: { xs: '0.85rem', md: '0.95rem' },
            lineHeight: 1.6,
            fontWeight: 300
          }}
        >
          {item.description}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(item.link)}
          sx={{
            bgcolor: brandColor,
            fontWeight: 800,
            borderRadius: '100px',
            textTransform: 'none',
            fontSize: { xs: '0.7rem', md: '0.75rem' },
            px: { xs: 4, md: 5 },
            py: { xs: 1.5, md: 1.8 },
            boxShadow: `0 10px 25px ${alpha(brandColor, 0.4)}`,
            '&:hover': { 
              bgcolor: '#d43d31',
              transform: { xs: 'none', md: 'translateY(-2px)' }
            },
            transition: 'all 0.3s ease'
          }}
        >
          Explorar Menú
        </Button> 
      </Box>
    </Paper>
  );
}