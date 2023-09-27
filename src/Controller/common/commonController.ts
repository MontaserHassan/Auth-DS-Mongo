import { Request, Response, NextFunction } from 'express';

import { Citizen, CitizenModel, Employee, CitizenProfile, CitizenProfileModel } from '../../Models/index.model';
import { AuthCitizenToken } from '../../Models/authCitizenToken.model';
import { AuthEmployeeToken } from '../../Models/authEmployeeToken.model';
import { EmployeeModel } from '../../Models/employee.model';


// -------------------------------------------- logout --------------------------------------------


const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entityId = req.currentUserId;
        const entityRole = req.currentUserRole === 'citizen' ? await AuthCitizenToken.findOneAndDelete({ citizenId: entityId }) : await AuthEmployeeToken.findOneAndDelete({ employeeId: entityId });
        res.status(200).send({ isSuccess: true, status: 200, message: `${entityRole._id}Logout successful` });
    } catch (error) {
        next(error);
    };
};


// -------------------------------------------- get profile --------------------------------------------


const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entityId = req.currentUserId;
        const entityRole = req.currentUserRole;
        let profileCredential: CitizenModel | EmployeeModel = entityRole === 'citizen' ? await Citizen.findById(entityId).select('-password') : await Employee.findById(entityId);
        let profile: CitizenProfileModel | null = await CitizenProfile.findOne({ citizenId: entityId }).select('-citizenId');
        profile === null ? res.status(200).send({ isSuccess: true, status: 200, profileCredential: profileCredential, profile: "please, complete your profile, User hasn't full profile" }) : res.status(200).send({ isSuccess: true, status: 200, profileCredential: profileCredential, profile: profile });
    } catch (error) {
        next(error);
    };
};



export default {
    logoutUser,
    getMyProfile,
};