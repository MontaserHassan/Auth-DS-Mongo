import { Request, Response, NextFunction } from 'express';
import { toDataURL } from 'qrcode';
import { authenticator } from 'otplib';

import { Employee } from '../../Models/index.model';
import CustomError from '../../Utils/customError.utils';
import createEmployeeToken from '../../Utils/createEmployeeTokens.utils';
import { EmployeeOTP } from '../../Models/userOTP.model';
import { AuthEmployeeToken } from '../../Models/authEmployeeToken.model';
import { AuthCitizenTokenModel } from '../../Models/authCitizenToken.model';


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
        // check if employee has token that isUsed equal true in authEmployeeToken table
        // const checkEmployeeIsLogged: AuthCitizenTokenModel = await AuthEmployeeToken.findOne({ userId: employeeAuthentication._id, isUsed: true });
        // if (checkEmployeeIsLogged) throw new CustomError('token', 'you can not login through 2 device', 401);
        if (!employeeAuthentication.qrcode) {
            authenticator.options = {
                step: 30,
                window: 5,
                epoch: Date.now(),
                digits: 6,
            };
            const secretKey = authenticator.generateSecret();
            const otpAuth = authenticator.keyuri(employeeAuthentication.phone_number, process.env.ISSUER_OTP, secretKey);
            toDataURL(otpAuth, async (err, code) => {
                if (err) throw new CustomError('QRCode', 'Failed to generate QR code', 500);
                employeeAuthentication.secretKey = secretKey;
                employeeAuthentication.qrcode = true;
                await Employee.updateOne({ phone_number: req.body.phone_number }, { $set: { secretKey: secretKey, qrcode: true } });
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
    try {
        const employeeAuthentication = await Employee.findOne({ phone_number: req.body.phone_number });
        if (!employeeAuthentication) throw new CustomError('phone_number', 'Incorrect phone number', 401);
        const checkExitingOTP = await EmployeeOTP.findOne({ otp: req.body.otp });
        if (checkExitingOTP) throw new CustomError('otp', 'This OTP already used, please use another one', 401);
        const isOTPValid = authenticator.check(req.body.otp, employeeAuthentication.secretKey);
        if (!isOTPValid) throw new CustomError('otp', 'Incorrect OTP', 401);
        const newEmployeeOTP = new EmployeeOTP({
            phone_number: req.body.phone_number,
            otp: req.body.otp,
            valid: false
        });
        await newEmployeeOTP.save();
        const token = await createEmployeeToken(employeeAuthentication);
        res.status(200).send({ isSuccess: true, status: 200, message: `Token created for ${employeeAuthentication.user_name} successfully`, token: token });
    } catch (err: any) {
        next(err);
    };
};



export default {
    registerEmployee,
    loginEmployee,
    sendToken,
};