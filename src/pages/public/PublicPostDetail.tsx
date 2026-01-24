import {JSX, useEffect, useState} from "react";
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { getPublicPostById, type PublicPostDto } from "../../services/posts.service";

export default function PublicPostDetail(): JSX.Element {
  const { id } = useParams();
  const [post, setPost] = useState<PublicPostDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error("missing id");
        setLoading(true);
        setError(null);
        const data: any = await getPublicPostById(id);
        setPost(data.data);
      } catch {
        setError("No se pudo cargar el detalle del post.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post)
    return (
      <Stack spacing={2}>
        <Typography variant="h5">Post no encontrado</Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Volver al Home
        </Button>
      </Stack>
    );

  return (
    <Stack spacing={2}>
      <Button variant="outlined" component={RouterLink} to="/" sx={{ width: "fit-content" }}>
        ← Volver
      </Button>

      <Stack direction="row" spacing={1} alignItems="center">
        <Chip size="small" label={post.category!.name || "General"} />
        <Typography variant="caption" color="text.secondary">
          {post.createdAt || ""}
        </Typography>
      </Stack>

      <Typography variant="h4">{post.title}</Typography>

      <Box sx={{ whiteSpace: "pre-wrap" }}>
        <Typography variant="body1" color="text.secondary">
          {post.content}
        </Typography>
      </Box>
    </Stack>
  );
}