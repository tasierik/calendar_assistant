import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Calendar as BigCalendar,
    momentLocalizer,
} from "react-big-calendar"
import moment from "moment"
import 'moment/locale/hu';
import {useEffect, useState} from "react";
import { useApiUtils } from '../Utils/ApiUtils.js';
import './pages.css'
import BookingPopUp from "../Components/BookingPopUp.jsx";
import {getRoomFromRooms, minusDay, plusDay} from "../Utils/BookingUtils.jsx";
import Loading from "../Components/Loading.jsx";


moment.locale('hu',
    {week: {
    dow: 1,
        doy: 1,
},})

const localizer = momentLocalizer(moment)
export default function Calendar(props) {
    const [rooms, setRooms] = useState({});
    const [bookings, setBookings] = useState([]);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    const { getBookings, getRooms } = useApiUtils();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let bookings = await getBookings();
            setBookings(bookings);
            setLoading(false);
        };
    
        if (!loading) {
            fetchData();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const rooms = await getRooms();
            setRooms(rooms);
            setLoading(false);
        };

        if (!loading) {
            fetchData();
        }
    }, []);

    if (loading || !rooms || !bookings) {
        return (
            <Loading/>
        )
    }

    //Function for enabling multiple colors for events
    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = getRoomFromRooms(event.room, rooms)?.color || '#722c61';
        const style = {
            backgroundColor: backgroundColor,
            borderRadius: '5px',
            color: 'white',
            border: '0px',
        };
        return {
            style: style
        };
    }
    
    const handleEventClick = (event) => {
        const plussedDayEvent = {
            ...event,
            end: plusDay(event.end, 1)
        };
        setSelectedEvent(plussedDayEvent);
    };
    
    const customStyles = {
        today: {
            backgroundColor: 'black',
        },
        height: 950
    };


    return (
        <>
            <h1 className="text-2xl font-semibold mb-5">Naptár</h1>
            <BookingPopUp
                isOpen={selectedEvent !== null}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
                rooms={rooms}
                />
            <BigCalendar
            {...props}
            localizer={localizer}
            events={bookings.map(booking => ({
                ...booking,
                end: minusDay(booking.end, 1)
            }))}
            dayLayoutAlgorithm="overlap"
            style={customStyles}
            views={['month']}
            eventPropGetter={eventStyleGetter}
            toolbar={{
                view: ['month'],
                agenda: ['today', 'prev', 'next'],
            }}
            popup
            onSelectSlot={() => setOverlayOpen(!overlayOpen)}
            overlay={overlayOpen ? null : false}
            onSelectEvent={(event) => handleEventClick(event)}/>
            </>
    )
}