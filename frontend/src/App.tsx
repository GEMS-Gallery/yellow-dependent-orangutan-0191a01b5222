import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2c3e50',
    },
    error: {
      main: '#e74c3c',
    },
  },
});

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', author: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await backend.createPost(newPost.title, newPost.body, newPost.author);
      setNewPost({ title: '', body: '', author: '' });
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url("https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ5NjgwNDl8&ixlib=rb-4.0.3")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <div>
          <Typography variant="h2" component="h1" gutterBottom>
            Crypto Blog
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Share your thoughts on the crypto world
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            Create Post
          </Button>
        </div>
      </Box>

      <Container maxWidth="md">
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          posts.map((post) => (
            <Card key={Number(post.id)} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                </Typography>
                <Typography variant="body1">{post.body}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="create-post-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Create New Post
          </Typography>
          <form onSubmit={handleCreatePost}>
            <TextField
              fullWidth
              label="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Author"
              value={newPost.author}
              onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Body"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default App;
