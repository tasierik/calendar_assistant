import CalendarIcon from '@heroicons/react/24/outline/CalendarIcon'
import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import HomeModernIcon from '@heroicons/react/24/outline/HomeModernIcon'
import Cog8ToothIcon from '@heroicons/react/24/outline/Cog8ToothIcon'



const iconClass = 'h-6 w-6'

const routes = [
    {
        path: '/app/calendar',
        icon: <CalendarIcon className={iconClass}/>,
        title: 'Naptár'
    },
    {
        path: '/app/bookings',
        icon: <BookOpenIcon className={iconClass}/>,
        title: 'Foglalások'
    },
    {
        path: '/app/reports',
        icon: <ChartBarIcon className={iconClass}/>,
        title: 'Kimutatások',
        isAdmin: true
    },
    {
        path: '/app/rooms',
        icon: <HomeModernIcon className={iconClass}/>,
        title: 'Apartmanok'
    },
    {
        path: '/app/settings',
        icon: <Cog8ToothIcon className={iconClass}/>,
        title: 'Beállítások',
        isAdmin: true
    }
]

export default routes;