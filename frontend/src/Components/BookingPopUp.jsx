import {formatDateString, getLabel, getRoomFromRooms} from "../Utils/BookingUtils.jsx";
import './components.css';
import {Link, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {ErrorContext} from "../Contexts/ErrorContext.jsx";
import {useApiUtils} from "../Utils/ApiUtils.js";

export default function EventPopUp({ isOpen, onClose, event, rooms }) {
    const { handleError, handleInfo } = useContext(ErrorContext);
    const isGuest = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'GUEST';
    const {deleteBooking, patchBooking } = useApiUtils()
    const navigate = useNavigate();
    const backToBookings = () => { navigate('/app/calendar');};

    const handleDelete = async (bookingId) => {
        try {
            await deleteBooking(bookingId);
            handleInfo('Foglalás sikeresen törölve!');
            backToBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            handleError('Hiba történt a foglalás törlése közben. Próbálja meg később.');
        }
    };

    const handlePayment = async (bookingId, on) => {
        try {
            await patchBooking(['paid'], { "paid": on }, bookingId);
            handleInfo('Fizetési státusz módosítva!');
            event.paid = on;
        } catch (error) {
            console.error('Error deleting booking:', error);
            handleError('Hiba történt a fizetési státusz módosítása közben. Próbálja meg később.');
        }
    };

    if (isOpen) {
        const currentRoom = getRoomFromRooms(event.room, rooms);
        return (
            <>
                <dialog open={isOpen} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Foglalás részletei</h3>
                        <table className="table table-lg table-zebra">
                            <tbody>
                            <tr>
                                <th>Név</th>
                                <td>
                                    <div className="alert">
                                        <span>{event.title}</span>
                                    </div>
                                </td>
                                <th>Foglaló felület</th>
                                <td>
                                    <div className="alert">
                                        <span>{getLabel(event.bookingPlatform)}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Foglalt egység</th>
                                <td>
                                    <div className="alert bg-[#272935]">
                                        <div className="badge" style={{ backgroundColor: currentRoom?.color }}>
                                            {currentRoom?.displayName}
                                        </div>
                                    </div>
                                </td>
                                <th>Vendégek száma</th>
                                <td>
                                    <div className="alert bg-[#272935]">
                                        <span>{event.numberOfGuests}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Érkezik</th>
                                <td>
                                    <div className="alert">
                                        <span>{formatDateString(event.start)}</span>
                                    </div>
                                </td>
                                <th>Távozik</th>
                                <td>
                                    <div className="alert">
                                        <span>{formatDateString(event.end)}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Fizetési mód</th>
                                <td>
                                    <div className="alert bg-[#272935]">
                                        <span>{getLabel(event.paymentMethod)}</span>
                                    </div>
                                </td>
                                <th>Ár</th>
                                <td>
                                    <div className="alert bg-[#272935]">
                                        <span>{event.totalPrice} {event.currency}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Fizetve</th>
                                <td>
                                    <div className="alert bg-[#272935]">
                                        <span>{
                                            event.paid ?
                                                <div className="badge badge-success">Igen</div>
                                                :
                                                <div className="badge badge-error">Nem</div>
                                        }</span>
                                    </div>
                                </td>
                                <th>Elérhetőség</th>
                                <td>
                                    <div className="alert bg-[#272935]">
                                        <span>{event.contact ? event.contact : "Nincs megadva"}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Megjegyzés</th>
                                <td colSpan={3}>
                                    <div className="alert bg-[#272935]">
                                        <span>{event.comment ? event.comment : "Nincs megadva"}</span>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        { isGuest &&
                            <div className="modal-action" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <button className="btn btn-lg" onClick={onClose} style={{ marginLeft: 'auto' }}>Bezárás</button>
                            </div>
                        }
                        { !isGuest &&
                            <div className="modal-action" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                { event.paid ?
                                    <button className="btn btn-lg btn-outline btn-warning" onClick={() => handlePayment(event.id, false)}>Fizettetés visszavonása</button> :
                                    <button className="btn btn-lg btn-outline btn-success" onClick={() => handlePayment(event.id, true)}>Fizettet</button>
                                }
                                <Link to={`/app/bookings/${event.id}/edit`} className="btn btn-lg btn-outline btn-warning mr-5">Módosítás</Link>
                                <button className="btn btn-lg btn-outline btn-error" onClick={() => handleDelete(event.id)}>Törlés</button>
                                <button className="btn btn-lg" onClick={onClose} style={{ marginLeft: 'auto' }}>Bezárás</button>
                            </div>
                        }
                </div>
                </dialog>
            </>
        )
    }
}
