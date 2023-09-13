import express from 'express';

import logout from './logout.routes';
import profile from './profile.routes';
import { getCurrentEntityLogged } from '../../Middleware/Auth/getEntity.middleware';


const router = express.Router();



router.use(getCurrentEntityLogged);
router.use('/profile', profile);
router.use('/logout', logout);



export default router;