import express from 'express';
import { userRoutes } from './routes/user.routes';
import { videosRoutes } from './routes/videos.routes';
import { config } from 'dotenv';

config();
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid4v = require('uuid')


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Acess-Control-Allow-Methods", 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/videos', videosRoutes);

const uploadDir = path.join(__dirname, '..', 'uploads');
 if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage ({
    destination: (req: any, file: any, cb: any) => {
        cb(null, uploadDir);
    },
    filename: (req: any, file: any, cb: any) => {
        const uniquename = `${uuid4v()}-${file.originalname}`
    }
});

export const upload = multer(storage)



app.listen(4000);