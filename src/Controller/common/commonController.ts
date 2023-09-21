import { Request, Response, NextFunction } from 'express';

import { Citizen, CitizenModel, Employee, CitizenProfile, CitizenProfileModel } from '../../Models/index.model';
import { AuthCitizenToken } from '../../Models/authCitizenToken.model';
import { AuthEmployeeToken } from '../../Models/authEmployeeToken.model';


// -------------------------------------------- logout --------------------------------------------


const logoutEntity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entityId = req.currentUserId;
        const entityRole = req.currentUserRole;
        if (entityRole === 'citizen') {
            await AuthCitizenToken.findOneAndDelete({ userId: entityId });
        } else {
            await AuthEmployeeToken.findOneAndDelete({ userId: entityId });
        };
        res.status(200).send({ isSuccess: true, status: 200, message: "Logout successful" });
    } catch (error) {
        next(error);
    };
};


// -------------------------------------------- get profile --------------------------------------------


const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entityId = req.currentUserId;
        const entityRole = req.currentUserRole;
        let profileCredential: CitizenModel;
        let profile: CitizenProfileModel;
        if (entityRole === 'citizen') {
            profileCredential = await Citizen.findById(entityId).select('-password');
            profile = await CitizenProfile.findOne({ citizenId: entityId }).select('-citizenId');
        } else {
            profile = await Employee.findById(entityId);
        };
        if (!profile) {
            res.status(200).send({ isSuccess: true, status: 200, profileCredential: profileCredential, profile: "please, complete your profile, User hasn't full profile" });
        } else {
            res.status(200).send({ isSuccess: true, status: 200, profileCredential: profileCredential, profile: profile });
        };
    } catch (error) {
        next(error);
    };
};



export default {
    logoutEntity,
    getMyProfile,
};