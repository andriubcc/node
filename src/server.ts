import express from 'express';
import { userRoutes } from './routes/user.routes';
import { videosRoutes } from './routes/videos.routes';

const app = express();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/videos', videosRoutes);

app.listen(4000);