import { model, Schema, Document } from 'mongoose';


interface EmployeeOTPModel extends Document {
    phone_number: string;
    otp: string;
    valid: boolean;
};


const employeeOTPSchema = new Schema<EmployeeOTPModel>(
    {
        phone_number: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true,
            unique: true
        },
        valid: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);


const EmployeeOTP = model<EmployeeOTPModel>("EmployeeOTP", employeeOTPSchema);



export {
    EmployeeOTP,
    EmployeeOTPModel,
};