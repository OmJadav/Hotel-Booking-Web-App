import User from "../models/userSchema.js";


export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        return res.status(200).json({ message: "User updated", updatedUser });
    } catch (err) {
        console.error("Error in updateUser", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "User has been deleted" });
    } catch (err) {
        console.error("Error in deleteUser", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
}
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        return res.status(200).json(user);
    } catch (err) {
        console.error("Error in getUser", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
}
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        console.error("Error in getUsers", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
}