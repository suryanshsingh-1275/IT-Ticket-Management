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

