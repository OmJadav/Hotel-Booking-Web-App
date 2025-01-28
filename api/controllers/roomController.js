import Room from "../models/roomSchema.js";
import Hotel from "../models/hotelSchema.js";


export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (err) {
            return res.status(400).json({ error: "something went wrong!" });
        }
        return res.status(200).json({ message: "Room created successfully", savedRoom });
    } catch (err) {
        console.error("Error in create room ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        return res.status(200).json({ message: "Room has been updated", updatedRoom });
    } catch (err) {
        console.error("Error in update room ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const updateRoomAvailability = async (req, res, next) => {
    try {
        await Room.updateOne(
            { "roomNumbers._id": req.params.id },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates
                },
            }
        );
        return res.status(200).json({ message: "Room status has been updated." });
    } catch (err) {
        console.error("Error in update room avaibility", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    try {
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: { rooms: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        return res.status(200).json("Room has been deleted.");
    } catch (err) {
        console.error("Error in delete room ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        return res.status(200).json(room);
    } catch (err) {
        console.error("Error in get room ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        return res.status(200).json(rooms);
    } catch (err) {
        console.error("Error in getting all room ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};