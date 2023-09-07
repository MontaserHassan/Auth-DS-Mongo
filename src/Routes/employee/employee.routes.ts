import express from 'express';

import authEmployee from './auth.routes';


const router = express.Router();


router.use('/auth', authEmployee);



export default router;