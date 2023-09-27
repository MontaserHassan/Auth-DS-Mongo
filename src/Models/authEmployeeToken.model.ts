import { model, Schema, Document, Model } from 'mongoose';


interface authEmployeeTokenModel extends Document {
    employeeId: any;
    token: string;
    endTime: Date;
    role: string;
    isUsed: boolean;
    active: boolean;
    removeExpiredTokens(): Promise<void>;
};


const authEmployeeTokenSchema = new Schema<authEmployeeTokenModel>(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'Wf_employees',
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
        },
        isUsed: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);


authEmployeeTokenSchema.methods.removeExpiredTokens = async function () {
    const currentTime = new Date(Date.now());
    await this.model('AuthEmployeeTokens').deleteMany({ endTime: { $lt: currentTime } });
};

const AuthEmployeeToken = model<authEmployeeTokenModel>('AuthEmployeeTokens', authEmployeeTokenSchema);



export {
    AuthEmployeeToken,
    authEmployeeTokenModel,
};