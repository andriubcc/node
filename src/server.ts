import express from 'express';
import { userRoutes } from './routes/user.routes';
import { videosRoutes } from './routes/videos.routes';
import { config } from 'dotenv';

config();
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Acess-Control-Allow-Methods", 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use(cors());
app.use(express.json());


const storage = multer.diskStorage ({
    destination: function(req: any, file: any, cb: any){
        cb(null, 'uploads/videos');
    },
    filename: function(req: any, file: any, cb: any) {
        cb(null, Date.now()+'-'+file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedFileType = /mp4|mov|avi|mkv/;
    const mimeType = allowedFileType.test(file.mimetype);
    const extname = allowedFileType.test(path.extname(file.originalname).toLowerCase());

    if(mimeType && extname) {
        return cb(null,true);
    } else {
        cb(new Error('Tipo de arquivo nao aceito'))
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = {upload};

app.use('/user', userRoutes);
app.use('/videos', videosRoutes);







app.listen(4000);