import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import connectDB from './src/Config/database.config';
import router from './src/Routes/index.routes'
import removeExpiredTokensUtils from './src/Utils/removeExpiredTokens.utils';


const app = express();

connectDB(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

removeExpiredTokensUtils();

app.use(router);