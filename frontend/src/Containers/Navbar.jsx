import { NavLink, useLocation } from "react-router-dom";
import routes from "../Routes/navbar.jsx";

export default function Navbar() {
  const location = useLocation();
  const isHost = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'HOST';
  return (
    <>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu pt-5 w-72 h-screen bg-base-200 text-base-content">
            {routes.map((route, k) => {
                if(route.isAdmin && !isHost) {
                    return null;
                }
                  return (
                    <li className="mt-2" key={k}>
                      {
                        <NavLink
                          end
                          to={route.path}
                          className={({ isActive }) =>
                            `${
                              isActive
                                ? "font-semibold bg-base-200 prose prose-l "
                                : "font-normal prose prose-l"
                            }`
                          }
                        >
                          {route.icon} {route.title}
                          {location.pathname === route.path ? (
                            <span
                              className="absolute inset-y-0 left-0 w-1 bg-primary "
                              aria-hidden="true"
                            ></span>
                          ) : null}
                        </NavLink>
                      }
                    </li>
                  );
            })}
          </ul>
        </div>
    </>
  );
}
