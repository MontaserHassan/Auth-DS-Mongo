import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';


const validation = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorValidation = [];
        ['params', 'query', 'body'].forEach((key) => {
            if (schema[key]) {
                const validation = schema[key].validate(req[key]);
                if (validation.error) {
                    errorValidation.push(validation.error);
                };
            };
        });
        if (errorValidation.length > 0) {
            throw { status: 422, message: errorValidation[0].details[0].message };
        } else {
            next();
        }
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};


const userValidator = {
    loginUser: {
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    },
    createUser: {
        body: Joi.object().keys({
            first_name: Joi.string().required().min(3).max(18),
            second_name: Joi.string().required().min(3).max(18),
            third_name: Joi.string().required().min(3).max(18),
            fourth_name: Joi.string().required().min(3).max(18),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(8),
            // password: Joi.string().required().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).message('Password must be at least 8 characters long and contain at least one letter and one number.'),
            nationality: Joi.string().required().min(3),
            phone_number: Joi.string().required().length(11),
            passport_or_national_id: Joi.string().required().length(14),
            address: Joi.string().required().min(3),
            job_title: Joi.string().required().min(2),
            gender: Joi.string().required(),
        })
    },
}



export {
    validation,
    userValidator,
}