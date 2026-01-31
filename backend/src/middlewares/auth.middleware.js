import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js'; // Default import (curly braces hata di)
import { config } from "dotenv"
config()

const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;



        if (!token) {
            return res.status(401).json({
                message: "Unauthorized! Please login first."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded && decoded == undefined) {
            return res.status(401).json({
                message: "Unauthorized! Please login first.",
                status: 401
            });
        }

        const foundUser = await userModel.findById(decoded._id || decoded.userId);


        if (!foundUser) {
            return res.status(401).json({
                message: "User not found. Authorization denied."
            });
        }

        req.user = foundUser;

        const accessToken = jwt.sign(
            { _id: foundUser._id, email: foundUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", accessToken);

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or Expired Token!",
            error: error.message
        });
    }
}

export default authMiddleware; // Default export clean tareeqe se