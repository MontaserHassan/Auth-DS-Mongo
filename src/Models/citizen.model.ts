import bcrypt from "bcrypt";
import { model, Schema, Document } from 'mongoose';


interface CitizenModel extends Document {
    verifyPassword(password: string): Boolean;
    first_name: string;
    second_name: string;
    third_name: string;
    fourth_name: string;
    nationality: string;
    passport_or_national_id: string;
    email: string;
    password: string;
    phone_number: string;
    address: string;
    job_title: string;
    role: string;
    gender: string;
};


const citizenSchema = new Schema<CitizenModel>(
    {
        first_name: {
            type: String,
            required: true
        },
        second_name: {
            type: String,
            required: true
        },
        third_name: {
            type: String,
            required: true
        },
        fourth_name: {
            type: String,
            required: true
        },
        nationality: {
            type: String,
            required: true
        },
        passport_or_national_id: {
            type: String,
            required: true,
            unique: true
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
        address: {
            type: String,
            required: true
        },
        job_title: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"],
            default: "male",
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



export { Citizen };