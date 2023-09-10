import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

import CustomError from '../../Utils/customError.utils';
import { Citizen } from '../../Models/index.model';
import { CitizenProfile } from '../../Models/citizenProfile.model';


// -------------------------------------------- register citizen --------------------------------------------


const registerCitizen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const checkUserExists = await Citizen.findOne({ email: req.body.email });
        if (checkUserExists) throw new CustomError('This E-mail already exists, please use another email', 400);
        const newCitizen = new Citizen({
            user_name: (req.body.user_name).toLowerCase(),
            email: (req.body.email).toLowerCase(),
            phone_number: req.body.phone_number,
            password: req.body.password,
        });
        const savedCitizen = await newCitizen.save();
        if (!savedCitizen) throw new CustomError('Internal server error', 500);
        // token after registration
        res.status(201).send({ isSuccess: true, status: 201, message: 'Citizen registered successfully', citizen: savedCitizen });
    } catch (err: any) {
        next(err);
    }
};


// -------------------------------------------- login citizen --------------------------------------------


const loginCitizen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.email || !req.body.password) throw new CustomError('Please provide email and password', 400);
        const citizenAuthentication = await Citizen.findOne({ email: (req.body.email).toLowerCase() });
        if (!citizenAuthentication) throw new CustomError('Incorrect Email or Password', 401);
        const isPasswordValid = citizenAuthentication.verifyPassword(req.body.password);
        if (!isPasswordValid) throw new CustomError('Incorrect Email or Password', 401);
        const expiresInMilliseconds: number = req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
        const token = jwt.sign({ id: citizenAuthentication._id, role: citizenAuthentication.role }, process.env.JWT_SECRET as string, { expiresIn: expiresInMilliseconds });
        res.cookie('auth-token', token, { maxAge: expiresInMilliseconds, httpOnly: true });
        res.status(200).send({ isSuccess: true, status: 200, message: `Citizen: ${citizenAuthentication.user_name} logged successfully`, token: token });
    } catch (err: any) {
        next(err);
    };
};


// -------------------------------------------- complete citizen info --------------------------------------------


const completeCitizenInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const citizenCredential = await Citizen.findById(req.currentUserId).select('-password');
        if (!req.body.passport_or_national_id || req.body.passport_or_national_id === undefined || req.body.passport_or_national_id === null) throw new CustomError('Please provide passport or national id', 400);
        const newCitizen = new CitizenProfile({
            citizenId: req.currentUserId,
            first_name: (req.body.first_name)?.toLowerCase(),
            second_name: (req.body.second_name)?.toLowerCase(),
            third_name: (req.body.third_name)?.toLowerCase(),
            fourth_name: (req.body.fourth_name)?.toLowerCase(),
            nationality: req.body.nationality?.toLowerCase(),
            passport_or_national_id: req.body.passport_or_national_id,
            address: (req.body.address)?.toLowerCase(),
            job_title: (req.body.job_title)?.toLowerCase(),
            gender: req.body.gender
        });
        const savedProfileCitizen = await newCitizen.save();
        if (!savedProfileCitizen) throw new CustomError('Internal server error', 500);
        res.status(201).send({ isSuccess: true, status: 200, message: 'Citizen completed his information successfully', citizenCredential: citizenCredential, citizen: savedProfileCitizen });
    } catch (err: any) {
        next(err);
    };
};



export default {
    registerCitizen,
    loginCitizen,
    completeCitizenInfo,
};