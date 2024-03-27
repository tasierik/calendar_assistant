import {useContext, useCallback} from 'react';
import {ErrorContext} from "../Contexts/ErrorContext.jsx";
import {today} from "./BookingUtils.jsx";
import {useAuth} from "../Contexts/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../Utils/Constants.jsx";


export const useApiUtils = () => {
    const { handleError } = useContext(ErrorContext);
    const { logout } = useAuth()
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const getData = async (url) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 403) {
                logout()
                navigate('/login')
                return
            }
            if (!response.ok) {
                throw new Error('Hálózati hiba ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                handleError(message);
            } else if (error.message === 'Failed to fetch') {
                //handleError('Problem with the server. Please come back later!');
            } else {
                console.log(error);
                handleError('Általános hiba történt.');
            }
            throw error;
        }
    };
    const getDataPaginate = async (url, page, size) => {
        try {
            url = `${url}?page=${page}&size=${size}`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 403) {
                logout()
            }
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response;
        } catch (error) {
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                handleError(message);
            } else if (error.message === 'Failed to fetch') {
                //handleError('Problem with the server. Please come back later!');
            } else {
                console.log(error);
                handleError('An unknown error occurred');
            }
            throw error;
        }
    };
    const postData = async (url, data) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            console.log(response)
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            handleError(error);
            throw error;
        }
    };
    const patchData = async (url, data, fields, id) => {
        const queryParams = fields ? `?fields=${fields.join(',')}` : '';
        console.log(fields)
        try {
            const response = await fetch(`${url}/${id}${queryParams}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify(data),
            });
            console.log(response)
            if (!response.ok) {
                console.log(response)
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            handleError(error);
            throw error;
        }
    };
    const deleteData = async (url) => {
        try {
            const response = await fetch(`${url}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response;
        } catch (error) {
            handleError(error);
            throw error;
        }
    };

    // Bookings
    const getBookings = useCallback(async () => {
        return await getData(`${API_URL}/v1/bookings`);
    }, []);
    const getBookingsPaginate = useCallback(async (page, size) => {
        const url = `${API_URL}/v1/bookings`;
        return await getDataPaginate(url, page, size);
    }, [getDataPaginate]);
    const getBooking = useCallback(async (id) => {
        return await getData(`${API_URL}/v1/bookings/${id}`);
    }, []);
    const postBooking = async (data) => {
        return await postData(`${API_URL}/v1/bookings`, data);
    };
    const patchBooking = async (fields, data, id) => {
        return await patchData(`${API_URL}/v1/bookings`, data, fields, id);
    };
    const deleteBooking = async (id) => {
        return await deleteData(`${API_URL}/v1/bookings/${id}`);
    };

    // Rooms
    const getRooms = useCallback(async () => {
        return await getData(`${API_URL}/v1/rooms`);
    }, []);
    const getAvailableRooms = useCallback(async (start, end) => {
        if (!start || !end) {
            start = today;
            end = today;
        }
        const url = `${API_URL}/v1/rooms/available?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
        return await getData(url);
    }, []);
    const getAvailableRoomsByBookingId = useCallback(async (bookingId, start, end) => {
        if (!start || !end) {
            start = today;
            end = today;
        }
        const url = `${API_URL}/v1/rooms/available?bookingId=${bookingId}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
        return await getData(url);
    }, []);
    const getRoom = useCallback(async (id) => {
        return await getData(`${API_URL}/v1/rooms/${id}`);
    }, []);
    const patchRoom = async (fields, data, id) => {
        return await patchData(`${API_URL}/v1/rooms`, data, fields, id);
    };
    const postRoom = async (data) => {
        return await postData(`${API_URL}/v1/rooms`, data);
    };
    const deleteRoom = async (id) => {
        return await deleteData(`${API_URL}/v1/rooms/${id}`);
    };

    //Login
    const handleRegister = async (username, password, propertyName) => {
        return await postData(`${API_URL}/v1/auth/register`,  {username, password, propertyName} );
    };
    const getRelatedUsers = useCallback(async () => {
        return await getData(`${API_URL}/v1/auth/relatedUsers`);
    }, []);
    const deleteUser = async (id) => {
        return await deleteData(`${API_URL}/v1/auth/users/${id}`);
    };

    // Reports
    const fetchYearlyIncome = useCallback(async (year) => {
        return await getData(`${API_URL}/v1/reports/income?type=yearly&year=${year}`);
    }, []);
    const fetchMonthlyIncome = useCallback(async (month) => {
        return await getData(`${API_URL}/v1/reports/income?type=monthly&month=${month}`);
    }, []);

    return {
        getBooking,
        getBookings,
        getBookingsPaginate,
        patchBooking,
        postBooking,
        deleteBooking,

        getRoom,
        getRooms,
        getAvailableRooms,
        getAvailableRoomsByBookingId,
        patchRoom,
        postRoom,
        deleteRoom,

        handleRegister,
        getRelatedUsers,
        deleteUser,

        fetchMonthlyIncome,
        fetchYearlyIncome
    };
};
