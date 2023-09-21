import jwt from 'jsonwebtoken'

import { AuthCitizenToken, AuthCitizenTokenModel } from "../Models/authCitizenToken.model";
import CustomError from "./customError.utils";


// -------------------------------------------- create token --------------------------------------------


async function createCitizenToken(user: any) {
    const expiresInMilliseconds: number = 30 * 24 * 60 * 60 * 1000; // day * hour * minute * second * millisecond
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: expiresInMilliseconds });
    const newAuthToken: AuthCitizenTokenModel = new AuthCitizenToken({
        userId: user._id,
        token: token,
        role: user.role,
        endTime: new Date(Date.now() + expiresInMilliseconds),
    });
    const savedAuthToken = await newAuthToken.save();
    if (!savedAuthToken) throw new CustomError('none', 'Internal server error', 500);
    return token;
};



export default createCitizenToken;