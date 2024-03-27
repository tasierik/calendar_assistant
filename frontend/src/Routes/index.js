import { lazy } from 'react'

const Bookings = lazy(() => import("../Pages/Bookings.jsx"));
const Calendar = lazy(() => import("../Pages/Calendar.jsx"));
const Rooms = lazy(() => import("../Pages/Rooms.jsx"));
const Reports = lazy(() => import("../Pages/Reports.jsx"));
const Settings = lazy(() => import("../Pages/Settings.jsx"));
const Login = lazy(() => import("../Pages/Login.jsx"));
const Booking = lazy(() => import("../Pages/Booking.jsx"));


const routes = [
    {
        path: 'bookings',
        component: Bookings,
    },
    {
        path: 'bookings/new',
        component: Booking,
    },
    {
        path: 'bookings/:id/edit',
        component: Booking,
    },
    {
        path: 'calendar',
        component: Calendar,
    },
    {
        path: 'rooms',
        component: Rooms,
    },
    {
        path: 'rooms/:id',
        component: Rooms,
    },
    {
        path: 'reports',
        component: Reports,
    },
    {
        path: 'settings',
        component: Settings,
    },
    {
        path: 'register',
        component: Login,
    }

]

export default routes;