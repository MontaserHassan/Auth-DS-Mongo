import express from 'express';

import logout from './logout.routes';
import profile from './profile.routes';
import { getCurrentUserLogged } from '../../Middleware/Auth/getUserLogged.middleware';


const router = express.Router();



router.use(getCurrentUserLogged);
router.use('/profile', profile);
router.use('/logout', logout);



export default router;