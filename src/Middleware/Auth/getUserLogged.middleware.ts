import { verify as jwtVerify } from 'jsonwebtoken';
import CustomError from '../../Utils/customError.utils';
import { Request, Response, NextFunction } from 'express';


const getCurrentUserLogged = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let decodedPayload;
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) throw new CustomError('none', 'Access denied', 401)
        const token = authHeader.split(' ')[1];
        if (!token) throw new CustomError('none', 'Access denied', 401);
        decodedPayload = jwtVerify(token, process.env.JWT_SECRET);
        if (decodedPayload) {
            req.currentUserId = decodedPayload.id;
            req.currentUserRole = decodedPayload.role;
            next();
        } else {
            throw new CustomError('none', 'Access denied', 401);
        };
    } catch (error) {
        next(error);
    };
};



export {
    getCurrentUserLogged
};