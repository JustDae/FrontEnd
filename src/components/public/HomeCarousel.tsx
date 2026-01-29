<<<<<<< HEAD
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
=======
import { Box, Typography, Button, Paper, alpha, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const items = [
  {
    name: "Especialidad de la Casa",
    description: "Prueba nuestro lomo saltado con el toque secreto del chef.",
<<<<<<< HEAD
    image: "/images/plato1.png",
    link: "/menu"
=======
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600",
    link: "#menu"
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
  },
  {
    name: "Postres Irresistibles",
    description: "El final dulce perfecto para tu comida.",
<<<<<<< HEAD
    image: "/images/plato2.png",
    link: "/menu"
=======
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600",
    link: "#menu"
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
  }
];

export function HomeCarousel() {
  const brandColor = '#F55345';

  return (
    <Box sx={{ 
<<<<<<< HEAD
      width: '100%', 
      position: 'relative',
     
      '& .swiper-pagination-bullet': {
        backgroundColor: '#ccc',
        opacity: 1,
      },
      '& .swiper-pagination-bullet-active': {
        backgroundColor: brandColor,
        width: '20px', 
=======
      width: '100%',
      height: { xs: '100dvh', md: '100vh' },
      position: 'relative',
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
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
        borderRadius: '4px',
        transition: 'width 0.3s'
      }
    }}>
      <Swiper
<<<<<<< HEAD
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
=======
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
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
      >
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <Item item={item} />
          </SwiperSlide>
        ))}
<<<<<<< HEAD
=======

        <IconButton className="nav-button prev-btn">
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} />
        </IconButton>
        <IconButton className="nav-button next-btn">
          <ArrowForwardIosIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} />
        </IconButton>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
      </Swiper>
    </Box>
  );
}

function Item({ item }: any) {
  const navigate = useNavigate();
  const brandColor = '#F55345';

<<<<<<< HEAD
=======
  const handleNavigation = () => {
    if (item.link.startsWith('#')) {
      const element = document.getElementById(item.link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(item.link);
    }
  };

>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
<<<<<<< HEAD
        height: { xs: '350px', md: '500px' },
        borderRadius: '16px',
        overflow: 'hidden',
        mx: { xs: 0, md: 1 },
        mt: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
=======
        height: '100%',
        width: '100%',
        borderRadius: 0,
        m: 0,
        p: 0,
        overflow: 'hidden'
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
      }}
    >
      <Box
        component="img"
        src={item.image}
        alt={item.name}
        sx={{
          width: '100%',
          height: '100%',
<<<<<<< HEAD
          objectFit: 'cover',
          filter: 'brightness(0.65)' 
        }}
      />

=======
          objectFit: 'cover'
        }}
      />

      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: {
          xs: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)',
          md: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
        },
        zIndex: 1
      }} />

>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
<<<<<<< HEAD
          left: { xs: '5%', md: '8%' },
          transform: 'translateY(-50%)',
          color: 'white',
          maxWidth: '500px',
=======
          left: { xs: '5%', md: '10%' },
          transform: 'translateY(-50%)',
          color: 'white',
          width: { xs: '90%', md: '600px' },
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          textAlign: 'left',
          zIndex: 10
        }}
      >
        <Typography
<<<<<<< HEAD
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: '1.8rem', md: '3rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
=======
          variant="h1"
          sx={{
            fontWeight: 900,
            mb: 1,
            fontSize: { 
              xs: 'clamp(1.5rem, 8vw, 2.5rem)', 
              md: 'clamp(2.5rem, 5vw, 4rem)' 
            },
            textTransform: 'uppercase',
            letterSpacing: { xs: '-1px', md: '-2px' },
            lineHeight: 1.1,
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          }}
        >
          {item.name}
        </Typography>
<<<<<<< HEAD
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
=======
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 4, 
            opacity: 0.8, 
            maxWidth: { xs: '100%', md: '450px' },
            fontSize: { xs: '0.8rem', md: '0.95rem' },
            lineHeight: 1.6,
            fontWeight: 300
          }}
        >
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          {item.description}
        </Typography>

        <Button
          variant="contained"
<<<<<<< HEAD
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
=======
          onClick={handleNavigation}
          sx={{
            bgcolor: brandColor,
            fontWeight: 800,
            borderRadius: '100px',
            textTransform: 'none',
            fontSize: { xs: '0.75rem', md: '0.8rem' },
            px: { xs: 3, md: 5 },
            py: { xs: 1.2, md: 1.8 },
            boxShadow: `0 10px 25px ${alpha(brandColor, 0.4)}`,
            '&:hover': { 
              bgcolor: '#d43d31',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Explorar Menú
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
        </Button> 
      </Box>
    </Paper>
  );
}