import { userModel } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;

        // 1. FIX: Validation Logic (Use || instead of &&)
        if (!email || !username || !password || !firstname || !lastname) {
            return res.status(400).json({
                message: "Please fill all the fields."
            });
        }

        // 2. Finding User (Duplicate Check)
        // (Wuh 'foundUsername' wala code hata diya kyunki ye block kaafi hai)
        const foundUser = await userModel.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (foundUser) {
            return res.status(400).json({
                message: "User already exists with this email or username."
            });
        }

        // 3. Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const registeredUser = await userModel.create({
            email,
            username,
            password: hashPassword,
            fullname: {
                firstname,
                lastname
            }
        });

        // 5. Response Clean up
        const securedResponse = registeredUser.toObject();
        delete securedResponse.password;

        // Token Generation
        const token = jwt.sign(
            { _id: registeredUser._id, email: registeredUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 6. Security: Cookie Options add kiye
        const options = {
            httpOnly: true, // Client side JS se access nahi hoga
            secure: process.env.NODE_ENV === "production", // HTTPS pr true
            sameSite: 'strict'
        };

        return res
            .status(201)
            .cookie("token", token, options)
            .json({
                message: "User registered successfully!",
                user: securedResponse,
                token: token
            });

    } catch (error) {

        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// --- LOGIN CONTROLLER ---

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        // Find User
        const foundUser = await userModel.findOne({ email }).select("+password");

        if (!foundUser) {
            return res.status(400).json({
                message: "Invalid credentials" // Security ke liye "No account found" mat bolo
            });
        }

        // Compare Password
        const matchPassword = await bcrypt.compare(password, foundUser.password);

        if (!matchPassword) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate Token
        const token = jwt.sign(
            { _id: foundUser._id, email: foundUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Response Clean up (Manual object banane ki zarurat nahi)
        const userResponse = foundUser.toObject();
        delete userResponse.password;

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        };

        return res
            .status(200)
            .cookie('token', token, options)
            .json({
                message: "User login successfully!",
                user: userResponse,
                token: token
            });

    } catch (error) {

        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default { registerUser, loginUser };