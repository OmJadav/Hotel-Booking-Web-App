import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, country, city, phone } = req.body;

        if (!name || !country || !email || !password || !phone || !city) {
            return res.status(400).json({ error: "Please Fill All the fields!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User Already Exists!" })
        }
        const newUser = new User({ name, country, email, password, phone, city })
        const createdUser = await newUser.save();
        if (createdUser) {
            res.status(201).json({ message: "User registered successfully!" });
        } else {
            res.status(400).json({ error: "Invalid signup user data" })
        }
    } catch (err) {
        console.error("Error in signup ::", err.message);
        return res.status(501).json({ error: "Signup Failed!" })
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            return res.status(201).json({ _id: user._id, name: user.name, email: user.email, country: user.country, phone: user.phone, city: user.city, message: "User Authorized" });
        } else {
            return res.status(400).json({ error: "Invalid Credentials!" });
        }
    } catch (err) {
        console.error("Error in login", err.message);
        return res.status(501).json({ error: "Login Failed!" })
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) })
        res.status(200).json({ message: "User Logged Out" })
    } catch (err) {
        console.error("Error in logout ::", err.message);
        return res.status(501).json({ error: "Logout Failed!" })
    }
}