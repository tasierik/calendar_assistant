import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import {getLabel, getRoomFromRooms} from "../Utils/BookingUtils.jsx";

const styles = StyleSheet.create({
    page: { flexDirection: 'column', padding: 10, backgroundColor: '#ffffff' },
    paidCard: {
        margin: 10,
        padding: 10,
        border: '2px solid #4ADE80',
        borderRadius: 8,
    },
    unpaidCard: {
        margin: 10,
        padding: 10,
        border: '2px solid #F59E0B',
        borderRadius: 8,
    },
    cardHeader: {
        fontSize: 13,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#000000',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#333333',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomStyle: 'solid',
    },
    tableCol: {
        width: '50%',
        padding: 2,
    },
    text: {
        color: '#000000',
        fontSize: 10
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
    },
    topHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000000',
    }
});



const BookingPDF = ({ bookings, rooms }) => {
    const paidBookings = bookings.filter(booking => booking.paid);
    const unpaidBookings = bookings.filter(booking => !booking.paid);

    const renderBookingCard = (booking, paidStyle) => (

    <View style={paidStyle}>
        <Text style={styles.cardHeader}>{booking.title}     |   {getRoomFromRooms(booking?.room, rooms)?.displayName}    |     {new Date(booking.start).toLocaleDateString()} - {new Date(booking.end).toLocaleDateString()}</Text>
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Név:</Text></View>
                <View style={styles.tableCol}><Text style={styles.text}>{booking.title}</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Foglaló felület:</Text></View>
                <View style={styles.tableCol}><Text style={styles.text}>{getLabel(booking.bookingPlatform)}</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Foglalt egység:</Text></View>
                <View style={styles.tableCol}><Text style={styles.text}>{getRoomFromRooms(booking?.room, rooms)?.displayName }</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Érkezik:</Text></View>
                <View style={styles.tableCol}><Text
                    style={styles.text}>{new Date(booking.start).toLocaleDateString()}</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Távozik:</Text></View>
                <View style={styles.tableCol}><Text
                    style={styles.text}>{new Date(booking.end).toLocaleDateString()}</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Vendégek száma:</Text></View>
                <View style={styles.tableCol}><Text style={styles.text}>{booking.numberOfGuests}</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Fizetési mód:</Text></View>
                <View style={styles.tableCol}><Text style={styles.text}>{getLabel(booking.paymentMethod)}</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Ár:</Text></View>
                <View style={styles.tableCol}><Text
                    style={styles.text}>{booking.totalPrice} {booking.currency}</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.text}>Komment:</Text></View>
                <View style={styles.tableCol}><Text style={styles.text}>{booking.comment}</Text></View>
            </View>
        </View>
    </View>
);


    const renderBookings = (bookings, paidStyle) => {
        return bookings.map((booking, index) => (
            <View key={index} wrap={false}>
                {renderBookingCard(booking, paidStyle)}
            </View>
        ));
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.topHeader}>Riport</Text>
                <Text style={styles.header}>Fizetett</Text>
                {renderBookings(paidBookings, styles.paidCard)}
                <Text style={styles.header}>Fizetetlen</Text>
                {renderBookings(unpaidBookings, styles.unpaidCard)}
            </Page>
        </Document>
    );

};

export default BookingPDF;
