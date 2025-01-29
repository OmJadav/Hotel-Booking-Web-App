import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from './routes/authRoutes.js'
import hotelRouter from './routes/hotelRoutes.js'
import userRouter from './routes/userRoutes.js'
import roomRouter from './routes/roomsRoutes.js'
dotenv.config();

const port = process.env.PORT || 8080
const app = express();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Database Connected ✅");
    } catch (error) {
        console.log("Database Connection Failed ❌");
        throw error
    }
}

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
))
app.use(cookieParser())
app.use(express.json());
// app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)

app.listen(port, () => {
    connectDb()
    console.log(`server is running on Port ${port}`);
})