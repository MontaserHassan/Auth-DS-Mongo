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


const citizenValidator = {
    loginCitizen: {
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    },
    createCitizen: {
        body: Joi.object().keys({
            user_name: Joi.string().required().min(3).max(35),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(8),
            // password: Joi.string().required().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).message('Password must be at least 8 characters long and contain at least one letter and one number.'),
            phone_number: Joi.string().required().length(11),
        })
    },
};

const citizenProfileValidator = {
    completeCitizenInfo: {
        // delete required -- national id is required only
        body: Joi.object().keys({
            passport_or_national_id: Joi.string().required().length(14),
            first_name: Joi.string().min(3).max(18),
            second_name: Joi.string().min(3).max(18),
            third_name: Joi.string().min(3).max(18),
            fourth_name: Joi.string().min(3).max(18),
            nationality: Joi.string().min(3),
            address: Joi.string().min(3),
            job_title: Joi.string().min(2),
            gender: Joi.string().valid('male', 'female')
        }),
    },
    updateCitizenInfo: {
        body: Joi.object().keys({
            passport_or_national_id: Joi.string().length(14),
            first_name: Joi.string().min(3).max(18),
            second_name: Joi.string().min(3).max(18),
            third_name: Joi.string().min(3).max(18),
            fourth_name: Joi.string().min(3).max(18),
            nationality: Joi.string().min(3),
            address: Joi.string().min(3),
            job_title: Joi.string().min(2),
            gender: Joi.string().valid('male', 'female')
        }),
    },
};



export {
    validation,
    citizenValidator,
    citizenProfileValidator
};