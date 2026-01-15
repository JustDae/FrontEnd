import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, Container, Grid, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HomeCarousel } from "../../components/HomeCarousel";

interface Post {
  id: number;
  title: string;
  summary?: string;
  content?: string;
  image?: string;
}

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const brandColor = '#F55345';
  const HEADER_HEIGHT = 70;

  useEffect(() => {
    axios
      .get("https://post-api.nael.live/posts")
      .then((res) => setPosts(res.data.data.items))
      .catch(() => setPosts([]));
  }, []);

  return (
    <Box sx={{ pt: `${HEADER_HEIGHT}px`, minHeight: '100vh', bgcolor: '#ffffff' }}>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <HomeCarousel />
      </Container>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 1 }}>
              Nuestro Menú
            </Typography>
            <Box sx={{ width: '50px', height: '4px', bgcolor: brandColor, mx: 'auto' }} />
          </Box>

          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
                    border: '1px solid #eee',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {post.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image}
                      alt={post.title}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {post.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {post.summary || (post.content ? post.content.slice(0, 90) + "..." : "")}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        bgcolor: brandColor,
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#d44336' }
                      }}
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      Ver Plato
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}