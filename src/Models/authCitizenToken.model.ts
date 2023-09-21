import { model, Schema, Document, Model } from 'mongoose';


interface AuthCitizenTokenModel extends Document {
    userId: any;
    token: string;
    endTime: Date;
    role: string;
    active: boolean;
    removeExpiredTokens(): Promise<void>;
};


const authCitizenTokenSchema = new Schema<AuthCitizenTokenModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Wf_citizens',
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
        role: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


authCitizenTokenSchema.methods.removeExpiredTokens = async function () {
    const currentTime = new Date(Date.now());
    await this.model('AuthCitizenTokens').deleteMany({ endTime: { $lt: currentTime } });
};

const AuthCitizenToken = model<AuthCitizenTokenModel>('AuthCitizenTokens', authCitizenTokenSchema);



export {
    AuthCitizenToken,
    AuthCitizenTokenModel,
};