import express from 'express';

import { citizenController } from '../../Controller/index.controller';
import { validation, citizenValidator } from '../../validation/joiValidation.validation';


const router = express.Router();


router.post('/register', validation(citizenValidator.createCitizen), citizenController.registerCitizen);
router.post('/login', validation(citizenValidator.loginCitizen), citizenController.loginCitizen);
// router.post('/login/verify', citizenController.sendCaptcha); // Adel



export default router;