import { v4 as uuidv4 } from 'uuid';

export const createDelivery = async (pool, deliveryData) => {
    const {
        pickupLocation,
        dropOffLocation,
        parcelType,
        vehicleType,
        packageDescription,
        specialInstructions,
        receiverName,
        receiverPhone,
        paymentOption,
        userId
    } = deliveryData;

    const deliveryId = uuidv4();

    const query = `
        INSERT INTO delivery (
          deliveryId, userId, pickupLocation, dropOffLocation,
          parcelType, vehicleType, packageDescription,
          specialInstructions, receiverName, receiverPhone,
          paymentOption
        )
        VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10,
        $11
        )
        RETURNING *;  
    `;

    const values = [
        deliveryId, userId, pickupLocation, dropOffLocation,
        parcelType, vehicleType, packageDescription,
        specialInstructions, receiverName, receiverPhone,
        paymentOption
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating delivery:', error.message);
        throw new Error('Database error while creating delivery');
    }
};

export const getDeliveriesByUserId = async (pool, userId) => {
    const query = `
    SELECT *  FROM delivery
    WHERE userId = $1
    ORDER BY createdAt DESC;
    `;

    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching deliveries:', error.message);
        throw new Error('Database error while fetching deliveries');
    }
};

export const getDeliveriesById = async (pool, deliveryId) => {
    const query = `
    SELECT * FROM delivery
    WHERE deliveryId = $1
    ORDER BY createdAt DESC;
    `;

    try {
        const result = await pool.query(query, [deliveryId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching delivery by ID:', error.message);
        throw new Error('Database error while fetching delivery by ID');
    }
};

export const deleteDeliveryById = async (pool, deliveryId) => {
    const query = `
    DELETE FROM delivery
    WHERE deliveryId = $1
    RETURNING *;
    `;

    try {
        const result = await pool.query(query, [deliveryId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting delivery by ID:', error.message);
        throw new Error('Database error while deleting delivery');
    }
};