import { Link, useLocation } from "react-router-dom";

import {
    FaHome,
    FaCompass,
    FaSearch,
    FaPlusCircle,
    FaUser
} from "react-icons/fa";

function MobileBottomNav() {

    const location = useLocation();

    const navItems = [
        { path: "/home", icon: <FaHome /> },
        { path: "/explore", icon: <FaCompass /> },
        { path: "/search", icon: <FaSearch /> },
        { path: "/create-post", icon: <FaPlusCircle /> },
        { path: "/profile", icon: <FaUser /> }
    ];

    return (

        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t flex justify-around py-3 md:hidden z-50">

            {
                navItems.map((item) => (

                    <Link
                        key={item.path}
                        to={item.path}
                        className={`text-2xl ${
                            location.pathname === item.path
                                ? "text-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        {item.icon}
                    </Link>

                ))
            }

        </div>

    );

}

export default MobileBottomNav;