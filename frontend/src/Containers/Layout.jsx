import Navbar from './Navbar.jsx'
import TopTitle from "../Components/TopTitle.jsx";
import { useLocation} from "react-router-dom";
import {PATHNAME_REGISTER, PATHNAME_LOGIN} from "../Utils/Constants.jsx";

export default function Layout({component}) {
    const location = useLocation();
    const isLogin = location.pathname === PATHNAME_LOGIN || location.pathname === PATHNAME_REGISTER
    return (
        <>
            { isLogin ? null : <TopTitle/>}
                <div className="flex h-full">
                    <div className="drawer lg:drawer-open">
                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                        <>
                            <div className="drawer-content flex flex-col ">
                                <div className="overflow-y-auto pt-10 px-10">
                                    {component}
                                </div>
                            </div>
                        </>
                        { isLogin ? null : <Navbar /> }
                    </div>
                </div>
        </>
    )
}