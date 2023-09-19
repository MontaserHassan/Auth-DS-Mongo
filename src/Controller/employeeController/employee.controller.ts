import { Request, Response, NextFunction } from 'express';
import QRCode from 'qrcode';
import { authenticator } from 'otplib';

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
        if (!employeeAuthentication.qrcode) {
            const stringData = JSON.stringify(employeeAuthentication)
            QRCode.toDataURL(stringData, async function (err, code) {
                if (err) throw new CustomError('QRCode', 'Incorrect phone number or Password', 401);
                employeeAuthentication.qrcode = true;
                await Employee.updateOne({ phone_number: req.body.phone_number }, { $set: { qrcode: true } });
                res.status(200).send({ isSuccess: true, status: 200, message: `Employee: send QRcode ${employeeAuthentication.user_name} successfully`, QRcode: code });
            });
        } else {
            res.status(200).send({ isSuccess: true, status: 200, message: `Employee: ${employeeAuthentication.user_name}, please give me new OTP` });
        };
    } catch (err: any) {
        next(err);
    };
};


// -------------------------------------------- send token --------------------------------------------


const sendToken = async (req: Request, res: Response, next: NextFunction) => {
    // read req.body.otp and validate with google Authenticator
    // check if true
    // const token = await createToken(employeeAuthentication);
    // res.status(200).send({ isSuccess: true, status: 200, message: `Employee: send QRcode ${employeeAuthentication.user_name} successfully`, token: token });
};



export default {
    registerEmployee,
    loginEmployee,
    sendToken,
};