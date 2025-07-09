import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/error.middleware.js'

import connectDB from "./db/index.js"

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
import userRouter from './routes/user.route.js'
import merchantRouter from './routes/merchant.routes.js'

// routes declaration
//app.use("/api/v1/users", userRouter)


const initializeApp = async () => {
    const { pgPool } = await connectDB();
    
    app.use((req, res, next) => {
        req.pgPool = pgPool;
        next();
    });
    
    // Routes
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/merchants", merchantRouter);
    
    // Error middleware - should be the last middleware
    app.use(errorHandler);
}

// Initialize the app but don't block export
initializeApp().catch(console.error);

export  {app}