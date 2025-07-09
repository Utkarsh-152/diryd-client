// import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const findUserById = async (pool, userId) => {
  const query = 'SELECT * FROM users_table WHERE userid = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};


export const findUserByPhone = async (pool, phoneNo) => {
  const query = 'SELECT * FROM users_table WHERE phoneno = $1';
  const result = await pool.query(query, [phoneNo]);
  return result.rows[0];
};

export const createUserWithPhone = async (pool, phoneNo) => {
  const userId = uuidv4();
  const query = `
    INSERT INTO users_table (userId, phoneNo)
    VALUES ($1, $2)
    RETURNING userId, phoneNo, createdAt
  `;
  const result = await pool.query(query, [userId, phoneNo]);
  return result.rows[0];
};

// export const saveAccessToken = async (pool, userId, token) => {
//   const query = `
//     UPDATE users_table 
//     SET accessToken = $1
//     WHERE userId = $2
//   `;
//   await pool.query(query, [token, userId]);
// };

export const saveAccessToken = async (pool, userId, token) => {
  const query = `
    UPDATE users_table 
    SET accessToken = $1, modifiedAt = NOW()
    WHERE userId = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [token, userId]);
  return rows[0]; // updated user
};
