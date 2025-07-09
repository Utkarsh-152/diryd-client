import { v4 as uuidv4 } from 'uuid';

export const isSeatAvailable = async (pool, tripId, seatId, from_stop_id, to_stop_id) => {
    const query = `
    SELECT 1 FROM bookings
    WHERE tripId = $1 AND seatId = $2
    AND (
    (from_stop_id < $4 AND to_stop_id > $3)
    )
    `;
    const values = [tripId, seatId, from_stop_id, to_stop_id];
    const result = await pool.query(query, values);
    return result.rowCount === 0;
}
export const createBooking = async (pool, bookingData) => {
    const {
        userId,
        tripId,
        seatId,
        from_stop_id,
        to_stop_id,
    } = bookingData;

    const available = await isSeatAvailable(pool, tripId, seatId, from_stop_id, to_stop_id);
    if (!available) {
        throw new Error('Seat not available for the selected segment');
    }

    const bookingId = uuidv4();
    const query = `
    INSERT INTO bookings (
      bookingId, userId, tripId, seatId, from_stop_id, to_stop_id, paymentStatus
      ) VALUES (
       $1, $2, $3, $4, $5, $6, 'Success'
      ) RETURNING *;
    `;
    const values = [bookingId, userId, tripId, seatId, from_stop_id, to_stop_id];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating booking:', error.message);
        throw new Error('Database error while creating booking');
    }
}

export const getBookingsByUserId = async (pool, userId) => {
    const query = `
    SELECT * FROM bookings
    WHERE userId = $1
    ORDER BY createdAt DESC;
    `;

    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        throw new Error('Database error while fetching bookings');
    }
}

export const getBookingsById = async (pool, bookingId) => {
    const query = `
    SELECT * FROM bookings
    WHERE bookingId = $1
    ORDER BY createdAt DESC;
    `;

    try {

    } catch (error) {
        console.error('Error fetching booking by ID:', error.message);
        throw new Error('Database error while fetching booking by ID');
    }
};

export const cancelBooking = async (pool, bookingId) => {
    const query = `
    DELETE FROM delivery
    WHERE deliveryId = $1
    RETURNING *;
    `;

    try {
        const result = await pool.query(query, [bookingId]);
        if (result.rowCount === 0) {
            throw new Error('Booking not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error canceling booking:', error.message);
        throw new Error('Database error while canceling booking');
    }
}