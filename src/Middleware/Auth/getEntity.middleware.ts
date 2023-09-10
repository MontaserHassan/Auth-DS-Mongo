import { verify as jwtVerify } from 'jsonwebtoken';
import CustomError from '../../Utils/customError.utils';
import { Request, Response, NextFunction } from 'express';


const getCurrentEntityLogged = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let decodedPayload;
        const token = req.header('Authorization');
        // const token = req.cookies['auth-token'];
        if (!token) throw new CustomError('Access denied', 401);
        decodedPayload = jwtVerify(token, process.env.JWT_SECRET);
        // console.log("decodedPayload: ", decodedPayload);
        if (decodedPayload) {
            req.currentUserId = decodedPayload.id;
            req.currentUserRole = decodedPayload.role;
            next();
        } else {
            throw new CustomError('Access denied', 401);
        }
    } catch (error) {
        next(error)
    }
};



export {
    getCurrentEntityLogged
};