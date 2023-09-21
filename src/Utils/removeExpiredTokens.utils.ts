import cron from 'node-cron';

import { AuthCitizenToken } from '../Models/authCitizenToken.model';
import { AuthEmployeeToken } from '../Models/authEmployeeToken.model';


const cronSchedule = '0 0 * * *';

export default async function removeExpiredTokens() {
    try {
        const expiredCitizenTokens = await AuthCitizenToken.find({ endTime: { $lt: new Date(Date.now()) } });
        const expiredEmployeeTokens = await AuthEmployeeToken.find({ endTime: { $lt: new Date(Date.now()) } });
        for (const token of expiredCitizenTokens) {
            await token.removeExpiredTokens();
            console.log('Expired tokens removed.');
        };
        for (const token of expiredEmployeeTokens) {
            await token.removeExpiredTokens();
            console.log('Expired tokens removed.');
        };
    } catch (error) {
        console.error('Error removing expired tokens:', error);
    };
};



cron.schedule(cronSchedule, removeExpiredTokens);