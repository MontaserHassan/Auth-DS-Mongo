import jwt from 'jsonwebtoken'

import { AuthCitizenToken, AuthCitizenTokenModel } from "../Models/authCitizenToken.model";
import CustomError from "./customError.utils";
import { CitizenModel } from '../Models/citizen.model';


// -------------------------------------------- create token --------------------------------------------


async function createCitizenToken(citizen: CitizenModel, rememberMe: number = 1) {
    const expiresInMilliseconds: number = rememberMe * Number(process.env.ONE_DAY);
    const token = jwt.sign({ id: citizen._id, role: citizen.role }, process.env.JWT_SECRET as string, { expiresIn: expiresInMilliseconds });
    const newAuthToken: AuthCitizenTokenModel = new AuthCitizenToken({
        citizenId: citizen._id,
        token: token,
        role: citizen.role,
        endTime: new Date(Date.now() + expiresInMilliseconds),
    });
    const savedAuthToken = await newAuthToken.save();
    if (!savedAuthToken) throw new CustomError('none', 'Internal server error', 500);
    return token;
};



export default createCitizenToken;