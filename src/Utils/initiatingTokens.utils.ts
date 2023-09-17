import jwt from 'jsonwebtoken'

import { AuthToken } from "../Models/authToken.model";
import CustomError from "./customError.utils";


// -------------------------------------------- create token --------------------------------------------


async function createToken(citizen: any) {
    const expiresInMilliseconds: number = 30 * 24 * 60 * 60 * 1000;
    const token = jwt.sign({ id: citizen._id, role: citizen.role }, process.env.JWT_SECRET as string, { expiresIn: expiresInMilliseconds });
    const newAuthToken = new AuthToken({
        userId: citizen._id,
        token: token,
        endTime: new Date(Date.now() + expiresInMilliseconds),
    });
    const savedAuthToken = await newAuthToken.save();
    if (!savedAuthToken) throw new CustomError('none', 'Internal server error', 500);
    return token;
};



export default createToken