import express from 'express';
import { employeeController } from '../../Controller/index.controller';



const router = express.Router();


router.post('/register', employeeController.registerEmployee);
router.post('/login', employeeController.loginEmployee);
router.post('/login/verify', employeeController.sendToken);



export default router;