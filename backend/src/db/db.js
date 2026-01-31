import mongoose, { mongo } from "mongoose";
import clr from 'colors'

const connectDb = () => {
    const connect = mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'ChatGpt'
    })

    connect.then(() => {
        console.log('Connect to Db'.black.bgYellow);
    }).catch((err) => {
        console.log(`Some error occured: ${err.message}`.red);
    })
}

export default connectDb;