import { Router } from 'express';
import { VideosRepository } from '../modules/videos/repositories/VideosRepository';
import { login } from '../middleware/login';


const server = require('../server')
const upload = server.upload

console.log('Upload middleware', upload);

const videosRoutes = Router();
const videosRepository = new VideosRepository();


videosRoutes.post('/create-video', login, (request, response) => {
    videosRepository.create(request, response);
})

videosRoutes.post('/get-videos', (request, response) => {
    videosRepository.getVideos(request, response);
})

videosRoutes.post('/search', (request, response) => {
    videosRepository.searchVideos(request, response);
})

videosRoutes.post('/upload-video', login, upload.single('video'), (request, response) => {
    videosRepository.uploadVideos(request, response);
})

export { videosRoutes };