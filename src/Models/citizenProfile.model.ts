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
        },
        second_name: {
            type: String,
        },
        third_name: {
            type: String,
        },
        fourth_name: {
            type: String,
        },
        nationality: {
            type: String,
        },
        passport_or_national_id: {
            type: String,
            unique: true,
            required: true
        },
        address: {
            type: String,
        },
        job_title: {
            type: String,
        },
        gender: {
            type: String,
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