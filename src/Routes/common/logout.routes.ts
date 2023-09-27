import express from 'express';

import { commonController } from '../../Controller/index.controller';


const router = express.Router();


router.delete('/', commonController.logoutUser);



export default router;