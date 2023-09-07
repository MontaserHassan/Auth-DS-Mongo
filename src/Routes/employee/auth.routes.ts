import express from 'express';
import { employeeController } from '../../Controller/index.controller';



const router = express.Router();


router.post('/register', employeeController.registerCitizen);
router.post('/login', employeeController.loginEmployee);



export default router;