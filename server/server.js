import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config'
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import adRoutes from './routes/ad.js';
const app = express();
mongoose.connect(process.env.DATABASE_URL)
    .then(() => { console.log("connected to database") })
    .catch((err) => { console.log(err) });
app.use(express.json({limit: '10mb'}));
app.use(morgan('dev'));
app.use(cors());
app.use('/api', authRoutes);
app.use('/api', adRoutes);
app.listen(8000, () => { console.log("running on port 8000") });