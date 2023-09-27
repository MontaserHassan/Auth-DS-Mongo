import jwt from 'jsonwebtoken'

import { AuthEmployeeToken, authEmployeeTokenModel } from "../Models/authEmployeeToken.model";
import CustomError from "./customError.utils";
import { EmployeeModel } from '../Models/employee.model';


// -------------------------------------------- create token --------------------------------------------


async function createEmployeeToken(employee: EmployeeModel) {
    // check if has token return it, else 
    const expiresInMilliseconds: number = Number(process.env.ONE_DAY);
    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET as string, { expiresIn: expiresInMilliseconds });
    const newAuthToken: authEmployeeTokenModel = new AuthEmployeeToken({
        employeeId: employee._id,
        token: token,
        role: employee.role,
        endTime: new Date(Date.now() + expiresInMilliseconds),
        isUsed: true
    });
    const savedAuthToken = await newAuthToken.save();
    if (!savedAuthToken) throw new CustomError('none', 'Internal server error', 500);
    return token;
};



export default createEmployeeToken;