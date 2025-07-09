import { v4 as uuidv4 } from 'uuid';

export const createMerchantDelivery = async (pool, deliveryData) => {
    const {
        merchantId,
        pickupLocation,
        receiverName,
        receiverPhone,
        deliveryAddress,
        parcelType,
        vehicleType,
        specialInstructions,
        estimatedPrice
    } = deliveryData;

    const deliveryId = uuidv4();

    const query = `
        INSERT INTO merchant_delivery (
            deliveryId, merchantId, pickupLocation, receiverName, receiverPhone,
            deliveryAddress, parcelType, vehicleType, specialInstructions, estimatedPrice
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10
        )
        RETURNING *;
    `;

    const values = [
        deliveryId, merchantId, pickupLocation, receiverName, receiverPhone,
        deliveryAddress, parcelType, vehicleType, specialInstructions, estimatedPrice
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating merchant delivery:', error.message);
        throw new Error('Database error while creating merchant delivery');
    }
};

export const getMerchantDeliveriesByMerchantId = async (pool, merchantId) => {
    const query = `
        SELECT * FROM merchant_delivery
        WHERE merchantId = $1
        ORDER BY createdAt DESC;
    `;

    try {
        const result = await pool.query(query, [merchantId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching merchant deliveries:', error.message);
        throw new Error('Database error while fetching merchant deliveries');
    }
};

export const getMerchantDeliveryById = async (pool, deliveryId) => {
    const query = `
        SELECT * FROM merchant_delivery
        WHERE deliveryId = $1;
    `;

    try {
        const result = await pool.query(query, [deliveryId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching merchant delivery by ID:', error.message);
        throw new Error('Database error while fetching merchant delivery by ID');
    }
};

export const deleteMerchantDeliveryById = async (pool, deliveryId) => {
    const query = `
        DELETE FROM merchant_delivery
        WHERE deliveryId = $1
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [deliveryId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting merchant delivery by ID:', error.message);
        throw new Error('Database error while deleting merchant delivery');
    }
};