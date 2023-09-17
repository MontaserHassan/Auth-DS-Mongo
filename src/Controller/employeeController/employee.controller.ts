import { Request, Response, NextFunction } from 'express';

import { Employee } from '../../Models/index.model';
import CustomError from '../../Utils/customError.utils';
import createToken from '../../Utils/initiatingTokens.utils';


// -------------------------------------------- register employee --------------------------------------------


const registerEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const checkUserExists = await Employee.findOne({ phone_number: req.body.phone_number });
        if (checkUserExists) throw new CustomError('phone_number', 'This Phone Number already exists, please use another phone_number', 400);
        const newEmployee = new Employee({
            name: (req.body.name).toLowerCase(),
            user_name: (req.body.user_name).toLowerCase(),
            password: req.body.password,
            phone_number: req.body.phone_number,
            role: req.body.role,
        });
        const savedEmployee = await newEmployee.save();
        if (!savedEmployee) throw new CustomError('none', 'Internal server error', 500);
        res.status(201).send({ isSuccess: true, status: 201, message: 'Employee registered successfully', employee: savedEmployee });
    } catch (err: any) {
        next(err);
    };
};


// -------------------------------------------- login employee --------------------------------------------


const loginEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.phone_number || !req.body.password) throw new CustomError('phone_number,password', 'Please provide phone number and password', 400);
        const employeeAuthentication = await Employee.findOne({ phone_number: req.body.phone_number });
        if (!employeeAuthentication) throw new CustomError('phone_number,password', 'Incorrect phone number or Password', 401);
        const isPasswordValid = employeeAuthentication.verifyPassword(req.body.password);
        if (!isPasswordValid) throw new CustomError('phone_number,password', 'Incorrect phone number or Password', 401);
        const token = await createToken(employeeAuthentication);
        res.status(200).send({ isSuccess: true, status: 200, message: `Employee: ${employeeAuthentication.user_name} logged successfully`, token: token });
    } catch (err: any) {
        next(err);
    };
};



export default {
    registerEmployee,
    loginEmployee,
};