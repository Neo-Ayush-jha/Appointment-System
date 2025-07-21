# Appointment Booking System - Frontend

A modern React application built with Vite and TypeScript for managing appointments, users, and organizations.

## Features

- **Authentication**: Login/Signup with JWT tokens
- **Role-based Access**: Different interfaces for customers, doctors, barbers, and admins
- **Appointment Management**: Book, reschedule, and cancel appointments
- **User Management**: Admin panel for managing users
- **Organization Management**: Create and manage organizations
- **Client Analytics**: Track client appointments and revenue
- **Responsive Design**: Works on all device sizes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Heroicons** for icons

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Update the `VITE_API_BASE_URL` in `.env` to point to your backend API.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx
│   ├── ProtectedRoute.tsx
│   ├── CreateAppointmentModal.tsx
│   ├── RescheduleModal.tsx
│   └── CreateOrganizationModal.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Appointments.tsx
│   ├── Users.tsx
│   ├── Organizations.tsx
│   └── Clients.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript types
│   └── index.ts
└── App.tsx             # Main app component
```

## User Roles

- **Customer**: Book and manage appointments
- **Doctor/Barber**: Manage client appointments and schedules
- **Admin**: Full system access including user and organization management

## API Integration

The frontend integrates with the Appointment Booking API with the following endpoints:

- Authentication: `/auth/login`, `/auth/signup`, `/auth/profile`
- Users: `/users` (CRUD operations)
- Organizations: `/organizations` (create, list, assign users)
- Appointments: `/appointments` (book, reschedule, cancel, feedback)

## Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:3000/api)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request