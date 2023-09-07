import bcrypt from "bcrypt";
import { model, Schema, Document } from 'mongoose';


interface EmployeeModel extends Document {
    verifyPassword(password: string): Boolean;
    name: string;
    username: string;
    password: string;
    role: string;
    phone_number: string;
};


const employeesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 15,
            maxLength: 60,
        },
        username: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 25,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["RA", "CA", "Finance"],
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
            unique: true,
            minLength: 11,
            maxLength: 11,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
            },
        },
    }
);


employeesSchema.pre('save', function preSave(next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

employeesSchema.methods.verifyPassword = function verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
};


const Employee = model<EmployeeModel>("Wf_employees", employeesSchema);



export { Employee };