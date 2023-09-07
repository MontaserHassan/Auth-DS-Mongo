import express from 'express';

import { citizenController, commonController } from '../../Controller/index.controller';
import { validation, citizenProfileValidator } from '../../validation/joiValidation.validation';


const router = express.Router();


router.get('/', commonController.getMyProfile);
router.post('/completeInfo', validation(citizenProfileValidator.completeCitizen), citizenController.completeCitizenInfo)



export default router;