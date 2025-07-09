import { v4 as uuidv4 } from 'uuid';

export const createMerchantWithPhone = async (pool, phoneNo) => {
    const merchantId = uuidv4();
    const query = `
        INSERT INTO merchants_table (merchantId, phoneNo)
        VALUES ($1, $2)
        RETURNING merchantId, phoneNo, createdAt
        `;
        try {
            const result = await pool.query(query, [merchantId, phoneNo]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating merchant:', error);
            throw new Error('Failed to create merchant');
        }
}

export const findMerchantById = async (pool, merchantId) => {
    const query = 'SELECT * FROM merchants_table WHERE merchantId = $1';
    try {
        const result = await pool.query(query, [merchantId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding merchant by ID:', error);
        throw new Error('Failed to find merchant by ID');
    }
}

export const findMerchantByPhone = async (pool, phoneNo) => {
    const query = 'SELECT * FROM merchants_table WHERE phoneNo = $1';
    try {
        const result = await pool.query(query, [phoneNo]);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding merchant by phone:', error);
        throw new Error('Failed to find merchant by phone');
    }
}

export const saveAccessToken = async (pool, merchantId, token) => {
    const query = `
        UPDATE merchants_table
        SET accessToken = $1, modifiedAt = NOW()
        WHERE merchantId = $2
        RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [token, merchantId]);
            return rows[0];
        } catch (error) {
            console.error('Error saving access token:', error);
            throw new Error('Failed to save access token');
        }
}

export const updateMerchantProfile = async (pool, merchantId, profileData) => {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, value] of Object.entries(profileData)) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
    }
    values.push(merchantId);

    const query = `
        UPDATE merchants_table
        SET ${fields.join(', ')}, modifiedAt = NOW()
        WHERE merchantId = $${idx}
        RETURNING *;
    `;
    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Error updating merchant profile:', error);
        throw new Error('Failed to update merchant profile');
    }
};