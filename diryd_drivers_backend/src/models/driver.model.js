import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';


export const createUser = async (pool, userData) => {
    const { email, password } = userData;
    
    // Generate UUID for userId
    const userId = uuidv4();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
        INSERT INTO drivers_data (userId, email, password)
        VALUES ($1, $2, $3)
        RETURNING userId, email, createdAt
    `;
    const query2 = `INSERT INTO driver_verification_data (userId) VALUES ($1)`
    const query3 = `INSERT INTO driver_service_details (userID) VALUES ($1)`
    
    const values = [userId, email, hashedPassword];
    
    try {
        const result = await pool.query(query, values);
        console.log("query 1 done")
        await pool.query(query2, [userId]);
        console.log("query 2 done")

        await pool.query(query3, [userId]);
        console.log("query 3 done")


        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const findUserByEmail = async (pool, email) => {
    const query = 'SELECT * FROM drivers_data WHERE email = $1';
    try {
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error;
    }
};

export const findUserByPhoneNo = async (pool, phoneno) => {
    const query = 'SELECT * FROM drivers_data WHERE phoneno = $1';
    try {
        const result = await pool.query(query, [phoneno]);
        return result.rows[0];
    } catch (error) {
        console.error("Error finding user by phoneno:", error);
        throw error;
    }
};

export const findUserById = async (pool, userId) => {
    const query = 'SELECT * FROM drivers_data WHERE userId = $1';
    try {
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error finding user by ID:", error);
        throw error;
    }
};

export const updateRefreshToken = async (pool, userId, refreshToken) => {
    const query = 'UPDATE drivers_data SET refreshToken = $1 WHERE userId = $2 RETURNING userId';
    try {
        const result = await pool.query(query, [refreshToken, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating refresh token:", error);
        throw error;
    }
};

export const addServiceType = async (pool, userId, serviceType) => {
    const query = `
        UPDATE drivers_data 
        SET serviceType = $1 
        WHERE userId = $2 
        RETURNING userId, serviceType, createdAt
    `;
    try {
        const result = await pool.query(query, [serviceType, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating service type:", error);
        throw error;
    }
};

export const addVehicleType = async (pool, userId, vehicleType) => {
    const query = `
        UPDATE drivers_data 
        SET vehicletype = $1 
        WHERE userId = $2 
        RETURNING userId, vehicletype, createdAt
    `;
    try {
        const result = await pool.query(query, [vehicleType, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting vehicle type:", error);
        throw error;
    }
};