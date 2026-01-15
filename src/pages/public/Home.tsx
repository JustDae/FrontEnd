import { useEffect, useState, type JSX } from "react";
import { Box, Typography, Card, CardContent, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  summary?: string;
  content?: string;
}

const HEADER_HEIGHT = 64;  // debe coincidir con el minHeight del Toolbar del AppBar

export function Home(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://post-api.nael.live/posts")
      .then((res) => setPosts(res.data.data.items))
      .catch(() => setPosts([]));
  }, []);

  return (
    <Box sx={{ pt: `${HEADER_HEIGHT}px`, pb: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Últimos posts
        </Typography>

        {posts.map((post) => (
          <Card
            key={post.id}
            sx={{
              mb: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {post.summary || (post.content ? post.content.slice(0, 100) + "..." : "")}
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate(`/post/${post.id}`)}
              >
                Leer más
              </Button>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
}