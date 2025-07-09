# DiRYd Driver Backend

A backend service for DiRYd driver management system built with Node.js, Express, and PostgreSQL.

## Features

- User Authentication (Register, Login, Logout)
- JWT Token Management
- Service Type Management
- Vehicle Type Management

## Requirements

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
DATABASE_URL=your_postgres_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the server:
```bash
npm start
```

## API Routes

### Authentication Routes

#### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "string",
    "password": "string",
    "fullname": "string"
}
```
- **Success Response**: 
```json
{
    "statusCode": 201,
    "data": {
        "id": "number",
        "userId": "uuid",
        "email": "string",
        "createdAt": "timestamp"
    },
    "message": "User registered successfully"
}
```

#### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "string",
    "password": "string"
}
```
- **Success Response**: 
```json
{
    "statusCode": 200,
    "data": {
        "user": {
            "id": "number",
            "userId": "uuid",
            "email": "string",
            "createdAt": "timestamp"
        },
        "accessToken": "string",
        "refreshToken": "string"
    },
    "message": "User logged in successfully"
}
```

#### Logout User
- **URL**: `/api/users/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Success Response**: 
```json
{
    "statusCode": 200,
    "data": {},
    "message": "User logged out successfully"
}
```

#### Refresh Access Token
- **URL**: `/api/users/refresh-token`
- **Method**: `POST`
- **Body**:
```json
{
    "refreshToken": "string"
}
```
- **Success Response**: 
```json
{
    "statusCode": 200,
    "data": {
        "accessToken": "string",
        "refreshToken": "string"
    },
    "message": "Access token refreshed"
}
```

### Driver Management Routes

#### Add Service Type
- **URL**: `/api/users/addService`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
```json
{
    "serviceType": "string"
}
```
- **Success Response**: 
```json
{
    "statusCode": 200,
    "data": {
        "userId": "uuid",
        "serviceType": "string",
        "createdAt": "timestamp"
    },
    "message": "Service type added successfully"
}
```

#### Add Vehicle Type
- **URL**: `/api/users/addVehicle`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
```json
{
    "vehicleType": "string"
}
```
- **Success Response**: 
```json
{
    "statusCode": 200,
    "data": {
        "userId": "uuid",
        "vehicleType": "string",
        "createdAt": "timestamp"
    },
    "message": "Vehicle type added successfully"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
    "statusCode": number,
    "message": "string",
    "errors": [],
    "stack": "string" // in development only
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Database Schema

The application uses a PostgreSQL database with the following main table:

### drivers_data
- userId (UUID, Primary Key)
- fullname (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR)
- serviceType (VARCHAR)
- vehicleType (VARCHAR)
- refreshToken (VARCHAR)
- createdAt (TIMESTAMP)

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes require valid access tokens
- Refresh tokens for token rotation