import express from 'express';
import { PORT } from './conf.js';
import postsRouter from './routes/posts.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use('/posts', postsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});