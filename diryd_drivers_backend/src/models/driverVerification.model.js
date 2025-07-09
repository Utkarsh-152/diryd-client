export const addVehicleRC = async (pool, userId, vehicleRC) => {
    const query = `
        UPDATE drivers_data 
        SET vehicleRC = $1 
        WHERE userId = $2 
        RETURNING userId, vehicleRC, createdAt
    `;
    try {
        const result = await pool.query(query, [vehicleRC, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating service type:", error);
        throw error;
    }
};

export const addAdhaarCard = async (pool, userId, adhaarCard) => {
    const query = `
        UPDATE drivers_data 
        SET adhaarCard = $1 
        WHERE userId = $2 
        RETURNING userId, adhaarCard, createdAt
    `;
    try {
        const result = await pool.query(query, [adhaarCard, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating service type:", error);
        throw error;
    }
};

export const addDrivingLicence = async (pool, userId, drivingLicense) => {
    const query = `
        UPDATE drivers_data 
        SET drivingLicense = $1 
        WHERE userId = $2 
        RETURNING userId, drivingLicense, createdAt
    `;
    try {
        const result = await pool.query(query, [drivingLicense, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating service type:", error);
        throw error;
    }
};