import {useState, useContext, useEffect, useRef} from "react";
import { useApiUtils } from '../Utils/ApiUtils.js';
import { ErrorContext } from "../Contexts/ErrorContext.jsx";
import {useParams, useResolvedPath, useNavigate} from "react-router-dom";
import {
    today,
    isValidObjectId,
    getRoomFromRooms,
    tomorrow
} from "../Utils/BookingUtils.jsx";
import Loading from "../Components/Loading.jsx";
import {BookingForm} from "../Components/BookingForm.jsx";

export default function Booking() {
    const navigate = useNavigate();
    const backToBookings = () => { navigate('/app/bookings');};
    let { id } = useParams();
    id = isValidObjectId(id) ? id : null;
    const isEdit = useResolvedPath().pathname.includes('edit')
    const [view, setView] = useState(id && !isEdit);
    const [booking, setBooking] = useState(null);
    const [rooms, setRooms] = useState(null);
    const [formData, setFormData] = useState(null);
    const { getBooking, postBooking, patchBooking, getAvailableRooms, getAvailableRoomsByBookingId, deleteBooking, getRooms } = useApiUtils();
    const { handleError, handleInfo } = useContext(ErrorContext);
    const isHost = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'HOST';
    const isGuest = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'GUEST';
    const [noRooms, setNoRooms] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const initialFormData = useRef(null);
    const heading = isEdit ? "Foglalás módosítása" : (id ? "Foglalás megtekintése" : "Új foglalás létrehozása");

    useEffect(() => {
        const fetchInitialData = async () => {
            if (id && !isEdit) {
                // View Mode
                setView(true);
                const roomsData = await getRooms()
                setRooms(roomsData)
                const bookingData = await getBooking(id);
                setBooking(bookingData);
            } else if (id && isEdit) {
                // Edit Mode
                setView(false);
                const bookingData = await getBooking(id);
                setBooking(bookingData);
                const roomsData = await getAvailableRoomsByBookingId(bookingData.id, bookingData.start, bookingData.end);
                setRooms(roomsData);
                setNoRooms(roomsData?.length === 0);
            } else {
                // New Mode
                setView(false);
                const roomsData = await getAvailableRooms(today, tomorrow);
                setRooms(roomsData);
                setNoRooms(roomsData?.length === 0);
                setFormData({
                    title: '',
                    bookingPlatform: 'booking',
                    room: (roomsData && roomsData.length > 0) ? roomsData[0].id : '',
                    start: today,
                    end: tomorrow,
                    numberOfGuests: '1',
                    paymentMethod: 'booking',
                    totalPrice: '0',
                    currency: "HUF",
                    contact: "",
                    paid: false,
                    comment: ''
                });
            }
        };
        fetchInitialData();
        initialFormData.current = { ...formData }
    }, [id, isEdit]);

    useEffect(() => {
        const updateAvailableRooms = async () => {
            //edit
            if (isEdit && formData) {
                const roomsData = await getAvailableRoomsByBookingId(id, formData.start, formData.end);
                setRooms(roomsData);
                setNoRooms(roomsData?.length === 0);
                if (roomsData.length > 0 && !roomsData.map(room => room.id).includes(booking.room)) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        room: roomsData[0].id
                    }))
                    handleInfo(`A kiválasztott apartman már nem elérhető a foglalás időpontjában. A foglalás apartmanja automatikusan át lett állítva a(z) ${roomsData[0].displayName} apartmanra.`);
                } else if (roomsData.length == 0) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        room: ''
                    }))
                    handleError('A kiválasztott időpontban nincs elérhető apartman. Válasszon másik időpontot!.')
                }
            } else if (!id && formData) { //new
                const roomsData = await getAvailableRooms(formData.start, formData.end);
                if (roomsData.length > 0) {
                    setRooms(roomsData);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        room: roomsData[0].id
                    }))
                } else {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        room: ''
                    }))
                    handleError('A kiválasztott időpontban nincs elérhető apartman. Válasszon másik időpontot!.')
                }
                setNoRooms(roomsData.length === 0);
            }
        };

        updateAvailableRooms();
    }, [formData?.start, formData?.end, isEdit, id]);

    useEffect(() => {
        if (booking) {
            setFormData({
                title: booking.title,
                bookingPlatform: booking.bookingPlatform,
                room: booking.room,
                start: booking.start,
                end: booking.end,
                numberOfGuests: booking.numberOfGuests,
                paymentMethod: booking.paymentMethod,
                totalPrice: booking.totalPrice,
                currency: booking.currency,
                contact: booking.contact,
                paid: booking.paid,
                comment: booking.comment
            });
        }
    }, [booking]);

    useEffect(() => {
        if (formData && rooms && !view
            && initialFormData.current?.room !== formData?.room) {
            setPriceBasedOnRoom();
        }
    }, [formData?.room, formData?.currency, rooms]);

    function setPriceBasedOnRoom() {
        if (formData?.room) {
            const room = getRoomFromRooms(formData?.room, rooms);
            if (room) {
                const price = formData?.currency === "HUF" ? room.priceInHuf : room.priceInEur;
                setFormData(prevFormData => ({
                    ...prevFormData,
                    numberOfGuests: room.capacity,
                    totalPrice: price
                }));
            }
        }
    }

    const validateForm = () => {
        let errors = {};
        for (const key in formData) {
            if (formData[key] === '' && key !== 'comment') {
                errors[key] = 'Kötelező kitölteni!';
            }
        }
        if (formData?.numberOfGuests && isNaN(formData?.numberOfGuests)) {
            errors.numberOfGuests = 'Érvénytelen szám!';
        }
        if (formData?.totalPrice && isNaN(formData?.totalPrice)) {
            errors.totalPrice = 'Érvénytelen szám!';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handlePost = async () => {
        if (validateForm()) {
            try {
                await postBooking(formData);
                handleInfo('Foglalás sikeresen létrehozva!');
                backToBookings()
            } catch (error) {
                console.error('Error creating booking:', error);
                handleError('Hiba történt a foglalás létrehozása közben. Próbálja meg később.');
            }
        }
    };
    const handlePatch = async () => {
        if (validateForm()) {
            const modifiedFields = {};
            for (const key in formData) {
                if (formData[key] !== booking[key]) {
                    modifiedFields[key] = formData[key];
                }
            }
            if (modifiedFields['paid']) {
                modifiedFields['paid'] = modifiedFields['paid'] === 'on'
            }
            try {
                await patchBooking(Object.keys(modifiedFields), formData, booking.id);
                handleInfo('Foglalás sikeresen módosítva!');
                backToBookings()
            } catch (error) {
                console.error('Error modifying booking:', error);
                handleError('Hiba történt a foglalás módosítása közben. Próbálja meg később.');
            }
        }
    };
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


    if (!rooms || !formData) {
        return (<Loading />)
    }

    return (
        <>
            <h1 className="text-2xl font-semibold mb-5">{heading}</h1>
            <div className="overflow-x-auto">
                <div className="navbar bg-base-200 rounded-box">
                    <div className="buttons">
                        <button className="btn btn-outline normal-case text-xl btn-neutral" onClick={backToBookings}>Vissza</button>
                        {view ?
                            <>
                                { !isGuest && <button className="btn btn-outline normal-case text-xl btn-warning ml-3" onClick={() => navigate(`/app/bookings/${id}/edit`)}>Módosítás</button>}
                                { isHost && <button className="btn btn-outline normal-case text-xl btn-error ml-3" onClick={() => handleDelete(id)}>Törlés</button>}
                            </>
                            : null}
                    </div>
                </div>
                <BookingForm
                    formData={formData}
                    setFormData={setFormData}
                    rooms={rooms}
                    formErrors={formErrors}
                    view={view}
                    noRooms={noRooms}
                />
                <div className="divider"></div>
                { view ?
                    null
                    :
                    (!isGuest && booking ?
                        (noRooms ?
                            <>
                            <button type="button" disabled="disabled" className="btn btn-outline btn-success text-xl mr-3 mt-3">Módosítás</button>
                            <button type="button" className="btn btn-outline btn-error text-xl mr-3 mt-3" onClick={() => setView(true)}>Elvetés</button>
                            </>
                            :
                            <>
                            <button type="button" className="btn btn-outline btn-warning text-xl mr-3 mt-3" onClick={handlePatch}>Módosítás</button>
                            <button type="button" className="btn btn-outline btn-error text-xl mr-3 mt-3" onClick={() => setView(true)}>Elvetés</button>
                            </>)
                        :
                        noRooms ? <button type="button" disabled="disabled" className="btn btn-outline btn-success text-xl mr-3 mt-3">Mentés</button>
                            : <button type="button" className="btn btn-outline btn-success text-xl mr-3 mt-3" onClick={handlePost}>Mentés</button>
                    )
                }

            </div>

        </>
    )

}