import { v4 as uuidv4 } from 'uuid';

export const createEmergencyContact = async (pool, emergencyData) => {
    const { userId, contactName, contactPhone } = emergencyData;

    const contactId = uuidv4();
    const query = `
    INSERT INTO emergency_contacts (contactId, userId, contactName, contactPhone)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `
    const values = [contactId, userId, contactName, contactPhone];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating emergency contact:', error.message);
        throw new Error('Database error while creating emergency contact')
    }
};

export const getEmergencyContactsByUserId = async (pool, userId) => {
    const query = `
    SELECT * FROM emergency_contacts
    WHERE userId = $1
    ORDER BY createdAt DESC;
    `;

    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching emergency contacts:', error.message);
        throw new Error('Database error while fetching emergency contacts');
    }
};