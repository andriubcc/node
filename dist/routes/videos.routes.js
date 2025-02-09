"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoutes = void 0;
const express_1 = require("express");
const VideosRepository_1 = require("../modules/videos/repositories/VideosRepository");
const login_1 = require("../middleware/login");
const videosRoutes = (0, express_1.Router)();
exports.videosRoutes = videosRoutes;
const videosRepository = new VideosRepository_1.VideosRepository();
videosRoutes.post('/create-video', login_1.login, (request, response) => {
    videosRepository.create(request, response);
});
videosRoutes.post('/get-videos', (request, response) => {
    videosRepository.getVideos(request, response);
});
videosRoutes.post('/search', (request, response) => {
    videosRepository.searchVideos(request, response);
});
