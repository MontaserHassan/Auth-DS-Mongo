import express from 'express';

import { citizenController, commonController } from '../../Controller/index.controller';
import { validation, citizenProfileValidator } from '../../validation/joiValidation.validation';


const router = express.Router();


router.get('/', commonController.getMyProfile);
router.post('/completeInfo', validation(citizenProfileValidator.completeCitizenInfo), citizenController.completeCitizenInfo)
router.patch('/updateInfo', validation(citizenProfileValidator.updateCitizenInfo), citizenController.updateCitizenInfo);



export default router;