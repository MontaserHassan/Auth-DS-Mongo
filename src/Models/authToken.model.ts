import { model, Schema, Document } from 'mongoose';


interface AuthTokenModel extends Document {
    userId: any;
    token: string;
    endTime: Date;
    remainingTime: Date;
};


const authTokenSchema = new Schema<AuthTokenModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Citizen',
            required: true
        },
        token: {
            type: String,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        remainingTime: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);


const AuthToken = model<AuthTokenModel>('AuthToken', authTokenSchema);



export {
    AuthToken,
    AuthTokenModel,
};