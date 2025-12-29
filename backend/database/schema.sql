-- Smart Event Planner Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS smart_event_planner;
USE smart_event_planner;

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255) NOT NULL,
    date_time DATETIME NOT NULL,
    category VARCHAR(100) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_organizer (organizer_id),
    INDEX idx_date_time (date_time),
    INDEX idx_category (category)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    attendee_id VARCHAR(255) NOT NULL,
    tickets_booked INT NOT NULL CHECK (tickets_booked > 0),
    total_price DECIMAL(10, 2) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event (event_id),
    INDEX idx_attendee (attendee_id)
);

