import { v4 as uuidv4 } from 'uuid';

export const createSchedule = async (pool, scheduleData) => {
    const {
        leavingFrom,
        goingTo,
        date,
        time,
        distanceKm,
        transportType,
        passengerCount,
        isReturn,
        returnDate,
        returnTime,
        estimatedPrice,
        userId // foreign key
    } = scheduleData;

    const scheduleId = uuidv4();

    const query = `
       INSERT INTO schedules (
         scheduleId, userId, leavingFrom, goingTo, date, time,
         distanceKm, transportType, passengerCount, isReturn,
         returnDate, returnTime, estimatedPrice       
       )
       VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10,
         $11, $12, $13
       )
       RETURNING *;
    `;

    const values = [
        scheduleId, userId, leavingFrom, goingTo, date, time,
        distanceKm, transportType, passengerCount, isReturn,
        returnDate, returnTime, estimatedPrice
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating schedule:', error.message);
        throw new Error('Database error while creating schedule');
    }
};

export const getSchedulesByUserId = async (pool, userId) => {
    const query = `
    SELECT * FROM schedules
    WHERE userId = $1
    ORDER BY date DESC, time DESC;
    `

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
        console.error('Error fetching schedules:', error.message);
        throw error;
    }
};

export const getScheduleById = async (pool, scheduleId) => {
    const query = `
    SELECT * FROM schedules
    WHERE scheduleId = $1;
    `;

    try {
      const result = await pool.query(query, [schedulId]);
      return result.rows[0];
    } catch (error) {
        console.error('Error fetching schedule by ID:', error.message);
        throw error;
    }
};

export const deleteScheduleById = async (pool, scheduleId) => {
    const query = `
    DELETE FROM schedules
    WHERE scheduleId = $1
    RETURNING *;
    `

    try {
        const result = await pool.query(query, [scheduleId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting schedule:', error.message);
        throw error;
    }
};