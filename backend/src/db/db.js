import mongoose, { mongo } from "mongoose";
import clr from 'colors'

const connectDb = () => {
    const connect = mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'ChatGpt'
    })

    connect.then(() => {

    }).catch((err) => {

    })
}

export default connectDb;