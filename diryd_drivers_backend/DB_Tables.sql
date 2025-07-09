CREATE TABLE drivers_data (
    userId VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    phoneNo VARCHAR(20),
    serviceType VARCHAR(50),
    vehicleType VARCHAR(50),
    profileImg TEXT,
	refreshToken VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shuttle_bookings (
  id INT PRIMARY KEY,
  vehicle_type VARCHAR(50),
  route VARCHAR(255),
  timing VARCHAR(50),
  seats INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);