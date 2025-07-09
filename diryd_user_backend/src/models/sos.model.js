import { v4 as uuidv4 } from 'uuid';

export const createSOS = async (pool, { userId, driverLocation, userLocation }) => {
    const sosId = uuidv4();
    const query = `
        INSERT INTO sos_events (sosId, userId, driverLocation, userLocation)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [sosId, userId, driverLocation, userLocation];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const createSharedLocation = async (pool, { userId, userLocation }) => {
    const shareId = uuidv4();
    const query = `
        INSERT INTO shared_locations (shareId, userId, userLocation)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [shareId, userId, userLocation];
    const result = await pool.query(query, values);
    return result.rows[0];
};