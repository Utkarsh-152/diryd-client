import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    let error = err;
    
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof SyntaxError ? 400 : 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        success: false,
        message: error.message,
        statusCode: error.statusCode,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    };

    return res.status(error.statusCode).json(response);
}; 