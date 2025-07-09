import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from "./db/index.js"
import { errorHandler } from "./middlewares/error.middleware.js"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import driverRouter from './routes/driver.route.js'
import shuttleRouter from './routes/shuttle.route.js'

// Initialize database connection and middleware
const initializeApp = async () => {
    const { pgPool } = await connectDB();
    
    app.use((req, res, next) => {
        req.pgPool = pgPool;
        next();
    });
    
    // Routes
    app.use("/api/users", driverRouter);
    app.use("/api/shuttle", shuttleRouter);


    // Error middleware - should be the last middleware
    app.use(errorHandler);
}

// Initialize the app but don't block export
initializeApp().catch(console.error);

export { app }