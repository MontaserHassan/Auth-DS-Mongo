import { model, Schema, Document, Model } from 'mongoose';


interface AuthTokenModel extends Document {
    userId: any;
    token: string;
    endTime: Date;
    removeExpiredTokens(): Promise<void>;
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
    },
    {
        timestamps: true
    }
);


authTokenSchema.methods.removeExpiredTokens = async function () {
    const currentTime = new Date(Date.now());
    await this.model('AuthToken').deleteMany({ endTime: { $lt: currentTime } });
};

const AuthToken = model<AuthTokenModel>('AuthToken', authTokenSchema);



export {
    AuthToken,
    AuthTokenModel,
};