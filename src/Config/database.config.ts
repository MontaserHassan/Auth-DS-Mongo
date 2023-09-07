import mongoose from "mongoose";
import startingApp from './startingApp.config';


const MONGO_URL: string = process.env.MONGO_URL || '';

const connectDB = (app: any) => {
    // docker
    // const DB_USER = 'root'
    // const DB_PASSWORD = 12345
    // const DB_PORT = 27017
    // const DB_HOST = 'mongo'
    // const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`
    // mongoose.connect(URI)
    //     .then(() => {
    //         console.log("Connected to MongoDB by using Docker successfully")
    //         startingApp(app);
    //     })
    //     .catch(error => console.error("Error connecting to MongoDB by using Docker:", error));

    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log("Connected to MongoDB successfully")
            startingApp(app);
        })
        .catch(error => console.error("Error connecting to MongoDB:", error))
};



export default connectDB;