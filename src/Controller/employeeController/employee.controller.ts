import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

import { Employee } from '../../Models/index.model';
import CustomError from '../../Utils/customError.utils';


// -------------------------------------------- register employee --------------------------------------------


const registerCitizen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const checkUserExists = await Employee.findOne({ phone_number: req.body.phone_number });
        if (checkUserExists) throw new CustomError('This Phone Number already exists, please use another phone_number', 400);
        const newEmployee = new Employee({
            name: (req.body.name).toLowerCase(),
            username: (req.body.username).toLowerCase(),
            password: req.body.password,
            phone_number: req.body.phone_number,
            role: req.body.role,
        });
        const savedEmployee = await newEmployee.save();
        if (!savedEmployee) throw new CustomError('Internal server error', 500);
        res.status(201).send({ isSuccess: true, status: 201, message: 'Employee registered successfully', employee: savedEmployee });
    } catch (err: any) {
        next(err);
    };
};


// -------------------------------------------- login employee --------------------------------------------


const loginEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.phone_number || !req.body.password) throw new CustomError('Please provide phone number and password', 400);
        const employeeAuthentication = await Employee.findOne({ phone_number: req.body.phone_number });
        if (!employeeAuthentication) throw new CustomError('Incorrect phone number or Password', 401);
        const isPasswordValid = employeeAuthentication.verifyPassword(req.body.password);
        if (!isPasswordValid) throw new CustomError('Incorrect phone number or Password', 401);
        const expiresInMilliseconds: number = req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
        const token = jwt.sign({ id: employeeAuthentication._id, role: employeeAuthentication.role }, process.env.JWT_SECRET as string, { expiresIn: expiresInMilliseconds });
        res.cookie('auth-token', token, { maxAge: expiresInMilliseconds });
        res.status(200).send({ isSuccess: true, status: 200, message: 'Employee logged successfully' });
    } catch (err: any) {
        next(err);
    };
};



export default {
    registerCitizen,
    loginEmployee,
}