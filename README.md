# Nettech Help Desk Ticket Management System

## Overview

Nettech Help Desk is a full-stack IT Ticket Management System designed to help employees raise support requests and allow administrators to manage, track, and resolve those requests efficiently.

## User Module

- User registration and login
- JWT-based authentication
- View personal tickets
- Create support tickets
- Search and filter tickets
- View ticket details
- Update profile information
- Upload profile picture
- Change password

## Admin Module

- Admin authentication
- Admin dashboard
- View all tickets
- View ticket statistics
- Search and filter tickets
- Update ticket status
- Delete tickets
- Monitor ticket priorities and categories

## Ticket Management

The system supports complete ticket management with the following operations:

- Create tickets
- Read ticket details
- Update ticket status
- Delete tickets
- Track ticket priority
- Track ticket category
- Track ticket creation date
- Associate tickets with users

## CRUD Operations

The application implements CRUD functionality for ticket management:

- **Create** — Users can create new support tickets.
- **Read** — Users and administrators can view ticket information.
- **Update** — Administrators can update ticket status.
- **Delete** — Administrators can delete tickets.

## Dashboard

The admin dashboard provides an overview of the ticket system, including:

- Total tickets
- Open tickets
- In-progress tickets
- Resolved tickets
- Ticket statistics

## Search & Filtering

Tickets can be searched and filtered based on relevant ticket information such as:

- Ticket title
- Ticket status
- Ticket priority
- Ticket category

## Responsive Design

The application is designed to work across different screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile

The interface uses responsive layouts and CSS to provide a consistent experience across devices.

## Bonus Features

### Ticket Priority

Tickets support different priority levels to help administrators identify important support requests.

### Profile Picture Upload

Users can upload and update their profile picture using the profile management system.

### Email Notifications

Nodemailer is implemented and configured to support SMTP-based email notifications for ticket-related events.

SMTP credentials are not configured in the deployed version, so email sending is currently not enabled in production.

## Technology Stack

### Frontend

- React
- JavaScript
- JSX
- CSS
- Vite
- Axios
- React Router

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Multer
- Nodemailer

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Deployment

- Render

## Architecture

The project follows a client-server architecture.

```text
React Frontend
      |
      | Axios / REST API
      v
Node.js + Express Backend
      |
      | Mongoose
      v
MongoDB Atlas
```

## Application Flow

```text
User
 |
 v
React Frontend
 |
 | HTTP Requests
 v
Express REST API
 |
 v
Authentication / Controllers
 |
 v
Mongoose
 |
 v
MongoDB Atlas
```

## REST API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### User Profile

```text
GET   /api/users/profile
PATCH /api/users/profile
PATCH /api/users/password
```

### Tickets

```text
POST   /api/tickets
GET    /api/tickets/mine
GET    /api/tickets
GET    /api/tickets/stats
GET    /api/tickets/:id
PATCH  /api/tickets/:id/status
DELETE /api/tickets/:id
```
## Project Structure

```text
IT_Help_Desk_Ticket_Management/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## Database

MongoDB Atlas is used as the cloud database.

Main collections include:

- Users
- Tickets

