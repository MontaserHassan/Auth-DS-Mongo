import express from 'express';

import { citizenController } from '../../Controller/index.controller';
import { validation, citizenProfileValidator } from '../../validation/joiValidation.validation';


const router = express.Router();


router.post('/completeInfo', validation(citizenProfileValidator.completeCitizenInfo), citizenController.completeCitizenInfo)
router.patch('/updateInfo', validation(citizenProfileValidator.updateCitizenInfo), citizenController.updateCitizenInfo);



export default router;