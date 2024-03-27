import {useContext, useEffect, useState} from "react";
import {useApiUtils} from "../Utils/ApiUtils.js";
import { Link} from "react-router-dom";
import {ErrorContext} from "../Contexts/ErrorContext.jsx";
import Pagination from "../Components/Pagination.jsx";
import BookingsTable from "../Components/BookingsTable.jsx";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const { getBookingsPaginate, getRooms, deleteBooking, patchBooking } = useApiUtils();
  const { handleError, handleInfo } = useContext(ErrorContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookingsPaginate(currentPage, pageSize);
        const responseData = await response.json();
        setBookings(responseData);
        const contentRange = response.headers.get('X-Content-Range');
        const totalElements = contentRange ? parseInt(contentRange.split('/')[2]) : 0;
        setTotalPages(Math.ceil(totalElements / pageSize));
      } catch (error) {
        console.error('Error fetching bookings:', error);
        handleInfo('Hiba történt a foglalások lekérdezése közben. Elképzelhető, hogy lejárt a munkamenet.');
      }
    };
    fetchBookings();
  }, [currentPage, bookings.length]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage - 1);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await getRooms();
      setRooms(rooms);
    };
    fetchRooms();
  }, [])

  const isHost = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'HOST';


  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      handleInfo('Foglalás sikeresen törölve!');
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      handleError('Hiba történt a foglalás törlése közben. Próbálja meg később.');
    }
  };
  const handlePayment = async (bookingId, on) => {
    try {
      const updatedBooking = await patchBooking(['paid'], { "paid": on }, bookingId);
      handleInfo('Fizetési státusz módosítva!');
      setBookings(prevBookings => prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
      ));
    } catch (error) {
      console.error('Error deleting booking:', error);
      handleError('Hiba történt a fizetési státusz módosítása közben. Próbálja meg később.');
    }
  };

  if (bookings) {
    return (
        <>
          <div className="overflow-x-auto">
            <h1 className="text-2xl font-semibold mb-5">Foglalások</h1>

            { isHost && <div className="navbar bg-base-200 rounded-box">
              <div className="buttons">
                <Link to="/app/bookings/new" className="btn btn-outline normal-case text-xl mr-3">Új foglalás</Link>
              </div>
            </div>}

            <div className="reservations pt-10">
              {bookings.length === 0 ? <h1 className="text-xl ml-3">Nincsenek foglalások</h1>
                  :
                  <BookingsTable
                      bookings={bookings}
                      rooms={rooms}
                      handlePayment={handlePayment}
                      isHost={isHost}
                      handleDelete={handleDelete}
                  />
              }
              <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </>
    )
  }

}