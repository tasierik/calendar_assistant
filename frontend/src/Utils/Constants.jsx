export const PATHNAME_REGISTER = "/app/register"
export const PATHNAME_LOGIN = "/app/login"

export const API_URL = "http://localhost:8000/api"

export const COLOR_PALETTE = [
    { color: '#039be5', disabled: false },
    { color: '#e67c73', disabled: false },
    { color: '#33b679', disabled: false },
    { color: '#d50000', disabled: false },
    { color: '#616161', disabled: false },
];

export const MONTH_MAP = new Map([
    ["Január", "January"],
    ["Február", "February"],
    ["Március", "March"],
    ["Április", "April"],
    ["Május", "May"],
    ["Junius", "June"],
    ["Julius", "July"],
    ["Augusztus", "August"],
    ["Szeptember", "September"],
    ["Október", "October"],
    ["November", "November"],
    ["December", "December"]
]);

export const BOOKING_PLATFORM_LABELS = {
    szallashu: 'Szállás.hu',
    booking: 'Booking.com',
    phone: 'Telefon',
    other: 'Egyéb',
    cash: 'Készpénz',
    transfer: 'Átutalás',
    szep: 'SZÉP kártya',
    unknown: 'Ismeretlen',
};
