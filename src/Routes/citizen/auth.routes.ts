import express from 'express';

import { citizenController } from '../../Controller/index.controller';
import { validation, userValidator } from '../../validation/joiValidation.validation';


const router = express.Router();


router.post('/register', validation(userValidator.createUser), citizenController.registerCitizen);
router.post('/login', validation(userValidator.loginUser), citizenController.loginCitizen);
// router.post('/register', citizenController.registerCitizen);
// router.post('/login', citizenController.loginCitizen);



export default router;