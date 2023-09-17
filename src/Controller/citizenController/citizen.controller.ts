import { Request, Response, NextFunction } from 'express';

import CustomError from '../../Utils/customError.utils';
import { Citizen } from '../../Models/index.model';
import { CitizenProfile } from '../../Models/citizenProfile.model';
import { AuthToken, AuthTokenModel } from '../../Models/authToken.model';
import createToken from '../../Utils/initiatingTokens.utils';


// -------------------------------------------- register citizen --------------------------------------------


const registerCitizen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingCitizen = await Citizen.findOne({ $or: [{ email: (req.body.email).toLowerCase() }, { phone_number: req.body.phone_number },] });
        if (existingCitizen) {
            if (existingCitizen.email === (req.body.email).toLowerCase()) {
                throw new CustomError('email', 'This E-mail already exists, please use another email', 400);
            } else {
                throw new CustomError('phone_number', 'This phone number already exists, please use another phone number', 400);
            };
        };
        const newCitizen = new Citizen({
            user_name: (req.body.user_name).toLowerCase(),
            email: (req.body.email).toLowerCase(),
            phone_number: req.body.phone_number,
            password: req.body.password,
        });
        const savedCitizen = await newCitizen.save();
        if (!savedCitizen) throw new CustomError('none', 'Internal server error', 500);
        const token = await createToken(savedCitizen);
        res.status(201).send({ isSuccess: true, status: 201, message: 'Citizen registered successfully', citizen: savedCitizen, token: token });
    } catch (err: any) {
        next(err);
    };
};


// -------------------------------------------- login citizen --------------------------------------------


const loginCitizen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.email || !req.body.password) throw new CustomError('email,password', 'Please provide email and password', 400);
        const citizenAuthentication = await Citizen.findOne({ email: (req.body.email).toLowerCase() });
        if (!citizenAuthentication) throw new CustomError('email,password', 'Incorrect Email or Password', 401);
        const isPasswordValid = citizenAuthentication.verifyPassword(req.body.password);
        if (!isPasswordValid) throw new CustomError('email,password', 'Incorrect Email or Password', 401);
        const existingToken: AuthTokenModel = await AuthToken.findOne({ userId: citizenAuthentication._id });
        if (existingToken) return res.status(200).send({ isSuccess: true, status: 200, message: `Citizen: ${citizenAuthentication.user_name} logged in with an existing token`, token: existingToken.token });
        const token = await createToken(citizenAuthentication);
        res.status(200).send({ isSuccess: true, status: 200, message: `Citizen: ${citizenAuthentication.user_name} logged successfully`, token: token });
    } catch (err: any) {
        next(err);
    };
};


// -------------------------------------------- complete citizen info --------------------------------------------


const completeCitizenInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const citizenCredential = await Citizen.findById(req.currentUserId).select('-password');
        if (!req.body.passport_or_national_id || req.body.passport_or_national_id === undefined || req.body.passport_or_national_id === null) throw new CustomError('passport_or_national_id', 'Please provide passport or national id', 400);
        const existingCitizenProfile = await CitizenProfile.findOne({ passport_or_national_id: req.body.passport_or_national_id });
        if (existingCitizenProfile) throw new CustomError('passport_or_national_id', 'This passport or national id already exists', 400);
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
        if (!savedProfileCitizen) throw new CustomError('none', 'Internal server error', 500);
        res.status(201).send({ isSuccess: true, status: 200, message: 'Citizen completed his information successfully', citizenCredential: citizenCredential, citizenProfile: savedProfileCitizen });
    } catch (err: any) {
        next(err);
    };
};


// -------------------------------------------- complete citizen info --------------------------------------------


const updateCitizenInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.hasOwnProperty('passport_or_national_id')) {
            if (req.body.passport_or_national_id === undefined || req.body.passport_or_national_id === null) {
                throw new CustomError('passport_or_national_id', 'Please provide a valid passport or national id', 400);
            } else {
                const existingNationalId = await CitizenProfile.findOne({ passport_or_national_id: req.body.passport_or_national_id });
                if (existingNationalId && (existingNationalId.citizenId).toString() !== req.currentUserId) {
                    throw new CustomError('passport_or_national_id', 'This passport or national id already exists', 400);
                };
            };
        };
        const citizenCredential = await Citizen.findById(req.currentUserId);
        const updatedCitizen = await CitizenProfile.findOneAndUpdate({ citizenId: req.currentUserId }
            , {
                first_name: (req.body.first_name)?.toLowerCase(),
                second_name: (req.body.second_name)?.toLowerCase(),
                third_name: (req.body.third_name)?.toLowerCase(),
                fourth_name: (req.body.fourth_name)?.toLowerCase(),
                nationality: (req.body.nationality)?.toLowerCase(),
                passport_or_national_id: req.body.passport_or_national_id,
                address: (req.body.address)?.toLowerCase(),
                job_title: (req.body.job_title)?.toLowerCase(),
                gender: (req.body.gender)?.toLowerCase(),
            }, { new: true });
        if (!updatedCitizen) throw new CustomError('none', 'Internal server error', 500);
        res.status(200).send({ isSuccess: true, status: 200, message: `Citizen: ${citizenCredential.user_name} updated his information successfully`, citizenCredential: citizenCredential, citizenProfile: updatedCitizen });
    } catch (err: any) {
        next(err);
    };
};



export default {
    registerCitizen,
    loginCitizen,
    completeCitizenInfo,
    updateCitizenInfo,
};