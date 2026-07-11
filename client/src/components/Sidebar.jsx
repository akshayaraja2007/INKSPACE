import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import {
    FaHome,
    FaCompass,
    FaSearch,
    FaPlusCircle,
    FaBell,
    FaUser
} from "react-icons/fa";

function Sidebar() {

    const location = useLocation();

    const { theme } = useTheme();   // ✅ Move here

    const menu = [
        {
            name: "Home",
            path: "/home",
            icon: <FaHome />
        },
        {
            name: "Explore",
            path: "/explore",
            icon: <FaCompass />
        },
        {
            name: "Search",
            path: "/search",
            icon: <FaSearch />
        },
        {
            name: "Create Post",
            path: "/create-post",
            icon: <FaPlusCircle />
        },
        {
            name: "Notifications",
            path: "/notifications",
            icon: <FaBell />
        },
        {
            name: "Profile",
            path: "/profile",
            icon: <FaUser />
        }
    ];

    return (
        <aside
            className={`hidden md:block w-60 h-screen p-6 shadow-lg ${
                theme === "dark"
                    ? "bg-gray-800"
                    : "bg-white"
            }`}
        >
            <ul className="space-y-3">

                {menu.map((item) => (

                    <li key={item.path}>

                        <Link
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition duration-200 ${
                                location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : theme === "dark"
                                        ? "text-white hover:bg-gray-700 hover:text-blue-400"
                                        : "text-gray-800 hover:bg-blue-100 hover:text-blue-600"
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>

                    </li>

                ))}

            </ul>

        </aside>
    );
}

export default Sidebar;