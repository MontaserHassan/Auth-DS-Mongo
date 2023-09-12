import { NextFunction, Request, Response } from 'express';

import CustomError from '../Utils/customError.utils';


export default function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;
    const field = err.path || 'none';
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ field: field, error: message });
};