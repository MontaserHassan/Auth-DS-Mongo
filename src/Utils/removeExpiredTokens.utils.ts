import cron from 'node-cron';

import { AuthToken } from '../Models/authToken.model';


const cronSchedule = '0 0 * * *';

export default async function removeExpiredTokens() {
    try {
        const expiredTokens = await AuthToken.find({ endTime: { $lt: new Date(Date.now()) } });
        for (const token of expiredTokens) {
            await token.removeExpiredTokens();
            console.log('Expired tokens removed.');
        };
    } catch (error) {
        console.error('Error removing expired tokens:', error);
    };
};

cron.schedule(cronSchedule, removeExpiredTokens);