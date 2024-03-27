import {BOOKING_PLATFORM_LABELS} from "./Constants.jsx";

export const getLabel = (value) => {
    return BOOKING_PLATFORM_LABELS[value] || BOOKING_PLATFORM_LABELS.unknown
}

export function isValidObjectId(id) {
    const regexExp = /^[0-9a-fA-F]{24}$/;
    return regexExp.test(id);
}

export function plusDay(date, days) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

export function jsDateToYMD(date) {
    return date.toISOString().slice(0, 10);
}

export function minusDay(date, days) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
}

export function formatDateString(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export function convertMongoDateToYMD(mongoDate) {
    return mongoDate.split('T')[0];
}
export function convertYMDToMongoDate(ymdDate) {
    return ymdDate + 'T00:00:00.000Z';
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase();
}

export const getRoomFromRooms = (id, rooms) => {
    if (id && Array.isArray(rooms)) {
        return rooms.find(room => room.id === id)
    }
}

export const today = new Date().toISOString().split('T')[0];
export const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
