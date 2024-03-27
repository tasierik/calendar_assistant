import {useEffect, useState} from 'react';
import Report from "../Components/Report.jsx";
import {useApiUtils} from "../Utils/ApiUtils.js";
import { PDFDownloadLink } from '@react-pdf/renderer';
import BookingPDF from '../Components/BookingPDF.jsx';

export default function Reports() {
    const { fetchYearlyIncome, fetchMonthlyIncome, getBookings, getRooms } = useApiUtils();
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const bookings = await getBookings();
            setBookings(bookings);
        };
        const fetchRooms = async () => {
            const rooms = await getRooms();
            setRooms(rooms);
        };
        fetchBookings();
        fetchRooms();
    }, []);



    return (
        <>
            <h1 className="text-2xl font-semibold mb-5">Kimutatások</h1>
            <div className="flex flex-wrap -mx-2 ">
                <div className="px-2 w-full md:w-1/2">
                    <Report
                        title="Aktuális év, havi forgalom"
                        mode="monthly"
                        action={fetchMonthlyIncome}
                    />
                </div>
                <div className="px-2 w-full md:w-1/2">
                    <Report
                        title="Éves forgalom"
                        mode="yearly"
                        action={fetchYearlyIncome}
                    />
                </div>
                <div className="px-2 w-full md:w-1/2">
                <div tabIndex={0} className=" collapse collapse-arrow border border-base-300 bg-base-200 mt-8">
                    <div className="collapse-title text-xl font-medium">Kifizetések</div>
                    {
                        bookings.length > 0 || rooms.length > 0 ?
                            <div className="m-8 space-y-3">
                                <PDFDownloadLink
                                    document={<BookingPDF bookings={bookings} rooms={rooms} />}
                                    fileName="booking-report.pdf"
                                    className="btn btn-secondary"
                                >
                                    {({ blob, url, loading, error }) =>
                                        loading ? 'Betöltés...' : 'Riport letöltése'
                                    }
                                </PDFDownloadLink>
                            </div>
                            :
                            <div className="m-8 space-y-3">
                                <div className="alert alert-error">Nincsenek foglalások.</div>
                            </div>
                    }
                </div>
                </div>
            </div>

        </>
    );
}
