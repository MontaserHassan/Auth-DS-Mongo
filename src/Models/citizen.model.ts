import bcrypt from "bcrypt";
import { model, Schema, Document } from 'mongoose';


interface CitizenModel extends Document {
    verifyPassword(password: string): Boolean;
    user_name: string;
    email: string;
    password: string;
    phone_number: string;
    role: string;
};


const citizenSchema = new Schema<CitizenModel>(
    {
        user_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone_number: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            default: "citizen",
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
            },
        },
    },
);


citizenSchema.pre('save', function preSave(next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

citizenSchema.methods.verifyPassword = function verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
};

const Citizen = model<CitizenModel>("Wf_citizens", citizenSchema);



export {
    Citizen,
    CitizenModel,
};