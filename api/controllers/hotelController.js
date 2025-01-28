import Room from "../models/roomSchema.js";
import Hotel from "../models/hotelSchema.js";

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);

    try {
        const savedHotel = await newHotel.save();
        return res.status(200).json({ message: "Hotel added successfully", savedHotel });
    } catch (err) {
        console.error("Error in createHotel ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        return res.status(200).json({ message: "Hotel updated successfully", updatedHotel });
    } catch (err) {
        console.error("Error in updateHotel ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Hotel has been deleted." });
    } catch (err) {
        console.error("Error in deleteHotel ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        return res.status(200).json(hotel);

    } catch (err) {
        console.error("Error in getHotel ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const getHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
        const hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gt: min | 1, $lt: max || 999 },
        }).limit(req.query.limit);
        if (!hotels) return res.status(404).json({ error: "No hotels found." });
        return res.status(200).json(hotels);
    } catch (err) {
        console.error("Error in all getHotels ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try {
        const list = await Promise.all(
            cities.map((city) => {
                return Hotel.countDocuments({ city: city });
            })
        );
        return res.status(200).json(list);
    } catch (err) {
        console.error("Error in countByCity ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};
export const countByType = async (req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
        const resortCount = await Hotel.countDocuments({ type: "resort" });
        const villaCount = await Hotel.countDocuments({ type: "villa" });
        const cabinCount = await Hotel.countDocuments({ type: "cabin" });

        return res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartments", count: apartmentCount },
            { type: "resorts", count: resortCount },
            { type: "villas", count: villaCount },
            { type: "cabins", count: cabinCount },
        ]);
    } catch (err) {
        console.error("Error in countByType", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};

export const getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        const list = await Promise.all(
            hotel.rooms.map(async (roomId) => {
                const room = await Room.findById(roomId);
                if (!room) {
                    return { error: `Room with ID ${roomId} not found` };
                }
                return room;
            })
        );
        return res.status(200).json(list)
    } catch (err) {
        console.error("Error in getHotelRooms ", err.message);
        return res.status(400).json({ error: "INTERNAL SERVER ERROR" });
    }
};