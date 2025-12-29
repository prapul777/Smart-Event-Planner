# Smart Event Planner & Ticketing Platform

A full-stack web application for creating events, browsing events, booking tickets, and managing attendees.

## 🛠️ Tech Stack

- **Frontend**: Angular 16 + Angular Material
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Architecture**: REST APIs, Role-based routing with Angular Guards

## 📋 Features

### User Roles

1. **Organizer**
   - Create events
   - Update events
   - Cancel events
   - View ticket sales
   - View attendees per event

2. **Attendee**
   - Browse events
   - View event details
   - Book tickets
   - View booking confirmation

## 🗄️ Database Schema

### Tables

1. **events**
   - id (PK)
   - organizer_id
   - name
   - description
   - venue
   - date_time
   - category
   - capacity
   - created_at

2. **bookings**
   - id (PK)
   - event_id (FK → events.id)
   - attendee_id
   - tickets_booked
   - total_price
   - booking_time

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Angular CLI 16

### Installation

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/installer/
   - Follow installation wizard
   - Remember your root password

2. **Install Angular CLI**
   ```bash
   npm install -g @angular/cli@16
   ```

3. **Install TypeScript** (optional)
   ```bash
   npm install -g typescript
   ```

### Database Setup

1. **Create Database**
   ```bash
   mysql -u root -p
   ```
   
2. **Run Schema Script**
   ```sql
   source backend/database/schema.sql
   ```
   
   Or manually:
   ```sql
   CREATE DATABASE smart_event_planner;
   USE smart_event_planner;
   -- Copy and paste the SQL from backend/database/schema.sql
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your MySQL credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=smart_event_planner
   NODE_ENV=development
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   
   Backend will run on: http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   
   Frontend will run on: http://localhost:4200

## 📁 Project Structure

```
smart-event-planner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   ├── event.controller.ts
│   │   │   └── booking.controller.ts
│   │   ├── routes/
│   │   │   ├── event.routes.ts
│   │   │   └── booking.routes.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── database/
│   │   └── schema.sql
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── event-list/
    │   │   │   ├── event-details/
    │   │   │   ├── ticket-booking/
    │   │   │   ├── booking-confirmation/
    │   │   │   ├── organizer-dashboard/
    │   │   │   └── not-authorized/
    │   │   ├── services/
    │   │   │   ├── event.service.ts
    │   │   │   └── booking.service.ts
    │   │   ├── guards/
    │   │   │   ├── organizer.guard.ts
    │   │   │   └── attendee.guard.ts
    │   │   └── app-routing.module.ts
    │   └── main.ts
    ├── package.json
    └── angular.json
```

## 🔌 API Endpoints

### Events
- `POST /api/events` - Create event
- `GET /api/events` - List events (with filters)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Cancel event

### Bookings
- `POST /api/bookings` - Book tickets
- `GET /api/bookings/event/:event_id` - Get bookings for event
- `GET /api/bookings/:id` - Get booking confirmation

## 🎯 Usage

### Switching Roles

1. Use the role selector in the navigation bar
2. Select "Attendee" to browse and book events
3. Select "Organizer" to create and manage events

### As Attendee

1. Browse events on the `/events` page
2. Click "View Details" to see event information
3. Click "Book Tickets" to make a booking
4. View booking confirmation after successful booking

### As Organizer

1. Navigate to `/organizer/dashboard`
2. Create new events using the form
3. View your events in the table
4. Click "View Sales" to see bookings and revenue
5. Edit or cancel events as needed

## 🔒 Role-Based Access

- **Attendee routes**: `/events`, `/events/:id`, `/events/:id/book`, `/booking/:id`
- **Organizer routes**: `/organizer/dashboard`
- Unauthorized access redirects to `/not-authorized`

## 📝 Notes

- No authentication system (roles stored in localStorage)
- No payment gateway integration
- QR code generation is optional (booking ID used as reference)
- Capacity validation ensures tickets don't exceed available seats

## 🐛 Troubleshooting

1. **MySQL Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in backend `.env`
   - Or kill process using the port

3. **Angular Build Errors**
   - Delete `node_modules` and reinstall
   - Check Node.js version (v16+)

## 📄 License

This project is created for educational purposes (college final-year project).

