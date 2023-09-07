import { model, Schema, Document } from 'mongoose';


interface CitizenProfileModel extends Document {
    citizenId: any;
    first_name: string;
    second_name: string;
    third_name: string;
    fourth_name: string;
    nationality: string;
    passport_or_national_id: string;
    address: string;
    job_title: string;
    role: string;
    gender: string;
};


const citizenProfileSchema = new Schema<CitizenProfileModel>(
    {
        citizenId: {
            type: Schema.Types.ObjectId,
            ref: 'Citizen',
            required: true
        },
        first_name: {
            type: String,
            required: true,
        },
        second_name: {
            type: String,
            required: true,
        },
        third_name: {
            type: String,
            required: true,
        },
        fourth_name: {
            type: String,
            required: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        passport_or_national_id: {
            type: String,
            unique: true,
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        job_title: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"],
            default: "male",
        },
    },
    {
        timestamps: true,
    },
);


const CitizenProfile = model<CitizenProfileModel>("CitizenProfile", citizenProfileSchema);



export {
    CitizenProfile,
    CitizenProfileModel,
};