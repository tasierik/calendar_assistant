import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../Contexts/AuthProvider.jsx';
import { useContext } from "react";
import routes from "../Routes/navbar.jsx";
import {DrawerContext} from "./DrawerProvider.jsx";

export default function TopTitle() {
    const navigate = useNavigate();
    const { userDetails, logout } = useAuth();
    const { isDrawerOpen, setIsDrawerOpen } = useContext(DrawerContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleHamburgerClick = (e) => {
        e.preventDefault();
        toggleDrawer();
    };

    if (userDetails.propertyName) {
        return (
            <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={toggleDrawer} />
                <div className="drawer-content flex justify-between items-center bg-base-200 h-full p-4">
                    {/* Hamburger Icon */}
                    <label htmlFor="my-drawer" className="btn btn-primary drawer-button lg:hidden" onClick={handleHamburgerClick}>
                        <Bars3Icon className="h-6 w-6 text-gray-600"/>
                    </label>

                    <span className="ml-6">
                        <Link to={"/app/calendar"} className="font-semibold text-xl">
                            <span className="prose prose-xl">NaptárAsszisztens</span>
                        </Link>
                    </span>

                    <div className="dropdown dropdown-hover dropdown-end" style={{ zIndex: 1000 }}>
                        <button tabIndex="0" className="btn btn-outline normal-case text-xl">{userDetails.propertyName}</button>
                        <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 right-0">
                            <li><a onClick={handleLogout}>Kijelentkezés</a></li>
                        </ul>
                    </div>
                </div>

                <div className="drawer-side">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className="menu p-4 overflow-y-auto w-full bg-base-100">
                        {routes.map((route, k) => {

                            return (
                                <li key={k}>
                                    <NavLink
                                        to={route.path}
                                        className={({ isActive }) => `${isActive ? "active" : ""}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        {route.icon} {route.title}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}