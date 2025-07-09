import pkg from 'pg';
const { Pool } = pkg;

// PostgreSQL Connection
const connectPostgreSQL = async () => {
    try {
        const pool = new Pool({
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DB,
        });

        const client = await pool.connect();
        console.log(`\n PostgreSQL connected !! DB HOST: ${process.env.POSTGRES_HOST}`);
        client.release();
        return pool;
    } catch(error) {
        console.log("PostgreSQL connection failed: ", error);
        process.exit(1)
    }
}

// Connect to both databases
const connectDB = async () => {
    const pgPool = await connectPostgreSQL();
    return { pgPool };
}

export default connectDB;