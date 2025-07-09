import { v4 as uuidv4 } from 'uuid';

export const addShuttleBooking = async (pool, vehicletype, timeSlot, startPoint, endPoint, seats) => {
    const shuttleId = uuidv4();
    
    const query = `
        INSERT INTO  shuttle_bookings (shuttleid, vehicletype, timeSlot, startPoint, endPoint, seats)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING shutterid, vehicletype, timeSlot, startPoint, endPoint, seats, createdAt
    `;
    try {
        const result = await pool.query(query, [shuttleId, vehicletype, timeSlot, startPoint, endPoint, seats]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting vehicle type:", error);
        throw error;
    }
};