import { Request, Response, NextFunction } from 'express';

import { Citizen, CitizenModel, Employee, CitizenProfile, CitizenProfileModel } from '../../Models/index.model';
import CustomError from '../../Utils/customError.utils';


// -------------------------------------------- logout --------------------------------------------


const logoutEntity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['auth-token'];
        if (!token) throw new CustomError('You are not logged in.', 401);
        res.cookie('auth-token', '', { expires: new Date(0) });
        res.status(200).json({ isSuccess: true, status: 200, message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};


// -------------------------------------------- get profile --------------------------------------------


const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entityId = req.currentUserId;
        const entityRole = req.currentUserRole;
        let profileCredential: CitizenModel;
        let profile: CitizenProfileModel;
        console.log('entityId: ', entityId);
        console.log('entityRole: ', entityRole);
        if (entityRole === 'citizen') {
            profileCredential = await Citizen.findById(entityId)
            profile = await CitizenProfile.findOne({ citizenId: entityId });
        } else {
            profile = await Employee.findById(entityId);
        };
        if (!profile) throw new CustomError('profile not found', 404);
        res.status(200).json({ isSuccess: true, status: 200, profileCredential: profileCredential, profile: profile });
    } catch (error) {
        next(error);
    }
};



export default {
    logoutEntity,
    getMyProfile,
};