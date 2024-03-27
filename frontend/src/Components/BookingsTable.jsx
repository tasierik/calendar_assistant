import { Link } from "react-router-dom";
import Eye from '@heroicons/react/24/outline/EyeIcon';
import { formatDateString, getLabel, getRoomFromRooms, capitalizeFirstLetter } from "../Utils/BookingUtils.jsx";

const iconClass = 'h-7 w-7';

const BookingsTable = ({ bookings, rooms, handlePayment, isHost, handleDelete }) => {
    const isGuest = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'GUEST';

    return (
        <table className="table">
            <thead>
            <tr>
                <th>
                </th>
                <th></th>
                <th>Név</th>
                <th>Foglaló felület</th>
                <th>Foglalt egység</th>
                <th>Érkezik</th>
                <th>Távozik</th>
                <th>Ár</th>
                <th>Fizetve</th>
                <th></th>
            </tr>
            </thead>
            <tbody>

            {!bookings || !rooms ? <span className="loading loading-spinner loading-lg"></span> : null}
            {bookings.map(booking => {
                const currentRoom = getRoomFromRooms(booking.room, rooms);
                return (
                    <tr key={booking.id}>
                        <th>
                        </th>
                        <th>
                            <Link to={`/app/bookings/${booking.id}`} className="btn btn-square">
                                <Eye className={iconClass}/>
                            </Link>
                        </th>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12 text-l"
                                         style={{backgroundColor: currentRoom?.color}}>
                                        <p>{currentRoom && capitalizeFirstLetter(currentRoom.displayName)}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">{booking.title}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="badge">{getLabel(booking.bookingPlatform)}</div>
                        </td>
                        <td>
                            <div className="badge" style={{backgroundColor: currentRoom?.color}}>
                                {currentRoom?.displayName}
                            </div>
                        </td>
                        <td>
                            {formatDateString(booking.start)}
                        </td>
                        <td>
                            {formatDateString(booking.end)}
                        </td>
                        <td>
                            {booking.totalPrice} {booking.currency}
                        </td>
                        <td>
                            {
                                booking.paid ?
                                    <div className="badge badge-success">Igen</div>
                                    :
                                    <div className="badge badge-error">Nem</div>
                            }
                        </td>
                        <th>
                            {
                                !isGuest &&
                                <div className="dropdown dropdown-bottom">
                                    <label tabIndex={0} className="btn btn-neutral btn-xs m-1">Műveletek</label>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        { booking.paid ?
                                            <li><a onClick={() => handlePayment(booking.id, false)} className="dropdown-item">Fizettetés visszavonása</a></li> :
                                            <li><a onClick={() => handlePayment(booking.id, true)} className="dropdown-item">Fizettet</a></li>
                                        }
                                        <li>
                                            <Link to={`/app/bookings/${booking.id}`} className="dropdown-item">Megtekintés</Link>
                                        </li>
                                        <li>
                                            <Link to={`/app/bookings/${booking.id}/edit`} className="dropdown-item">Módosítás</Link>
                                        </li>
                                        {isHost &&
                                            <>
                                                <li>
                                                    <a onClick={() => handleDelete(booking.id)} className="dropdown-item">Törlés</a>
                                                </li>
                                            </>
                                        }
                                    </ul>
                                </div>
                            }
                        </th>
                    </tr>
                )
            })}

            </tbody>
            <tfoot>
            <tr>
                <th></th>
                <th></th>
                <th>Név</th>
                <th>Foglaló felület</th>
                <th>Foglalt egység</th>
                <th>Érkezik</th>
                <th>Távozik</th>
                <th>Ár</th>
                <th>Fizetve</th>
                <th></th>
            </tr>
            </tfoot>

        </table>
    );
};

export default BookingsTable;
