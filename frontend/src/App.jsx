import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import {createContext, lazy, Suspense, useContext, useEffect, useState} from 'react'
import {AuthProvider} from "./Contexts/AuthProvider.jsx";
import ProtectedComponent from "./Components/ProtectedComponent.jsx";
import {ErrorContext, ErrorProvider} from "./Contexts/ErrorContext.jsx";
import PopUp from "./Components/PopUp.jsx";
import Loading from "./Components/Loading.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import {DrawerProvider} from "./Components/DrawerProvider.jsx";


export const DrawerContext = createContext();
function App() {
    const RedirectToAppRoute = () => {
        const navigate = useNavigate();
        const { path } = useParams();

        useEffect(() => {
            navigate(`/app/${path}`);
        }, [path, navigate]);

        return <div>Navigating...</div>;
    };
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const Layout = lazy(() => import('./Containers/Layout.jsx'))
    const Login = lazy(() => import('./Pages/Login.jsx'))
    const Bookings = lazy(() => import('./Pages/Bookings.jsx'))
    const Calendar = lazy(() => import("./Pages/Calendar.jsx"));
    const Rooms = lazy(() => import("./Pages/Rooms.jsx"));
    const Room = lazy(() => import("./Pages/Room.jsx"));
    const Reports = lazy(() => import("./Pages/Reports.jsx"));
    const Settings = lazy(() => import("./Pages/Settings.jsx"));
    const Booking = lazy(() => import("./Pages/Booking.jsx"));
    return (
        <>
            <ErrorProvider>
                <AuthProvider>
                    <DrawerProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/app/*" element={
                                <ProtectedComponent>
                                    <Suspense fallback={<Layout component={<Loading/>}/>}>
                                        <Routes>
                                            <Route path="calendar" element={<Layout component={<Calendar />}/>} />
                                            <Route path="bookings" element={<Layout component={<Bookings />}/>} />
                                            <Route path="bookings/:id" element={<Layout component={<Booking />}/>} />
                                            <Route path="bookings/:id/edit" element={<Layout component={<Booking />}/>} />
                                            <Route path="reports" element={<Layout component={<Reports />}/>} />
                                            <Route path="rooms" element={<Layout component={<Rooms />}/>} />
                                            <Route path="rooms/:id" element={<Layout component={<Room />}/>} />
                                            <Route path="rooms/:id/edit" element={<Layout component={<Room />}/>} />
                                            <Route path="settings" element={<Layout component={<Settings />}/>} />
                                        </Routes>
                                    </Suspense>
                                </ProtectedComponent>
                            } />
                            <Route path="*" element={<RedirectToAppRoute />} />
                            <Route path="/" element={<Navigate to="/app/bookings" replace />} />
                            <Route path="/app" element={<Navigate to="/app/bookings" replace />} />
                        </Routes>
                    </BrowserRouter>
                    </DrawerProvider>
                    <ErrorConsumer />
                </AuthProvider>
            </ErrorProvider>
        </>
    )
}

const ErrorConsumer = () => {
    const { isErrorPopUpOpen, errorMessage, handleCloseErrorPopUp, isError } = useContext(ErrorContext);

    return (
        <PopUp
            isOpen={isErrorPopUpOpen}
            onClose={handleCloseErrorPopUp}
            message={errorMessage}
            isError={isError}
        />
    );
}


export default App
