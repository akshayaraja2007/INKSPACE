import { useNavigate } from "react-router-dom";

import {
    FaMoon,
    FaSun,
    FaUserCircle,
    FaSignOutAlt
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

function Navbar() {

    const { theme, toggleTheme } = useTheme();

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (

        <nav
            className={
                theme === "dark"
                    ? "bg-gray-800 text-white shadow-lg"
                    : "bg-white text-black shadow-lg"
            }
        >

            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

                <h1
                    className="text-3xl font-bold text-blue-600 cursor-pointer"
                    onClick={() => navigate("/home")}
                >
                    InkSpace
                </h1>

                <div className="flex items-center gap-5">

                    <button
                        onClick={toggleTheme}
                        className="text-xl hover:scale-110 transition"
                    >
                        {
                            theme === "dark"
                                ? <FaSun />
                                : <FaMoon />
                        }
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                        className="text-2xl hover:text-blue-600 transition"
                    >
                        <FaUserCircle />
                    </button>

                    <button
                        onClick={logout}
                        className="text-red-500 text-xl hover:scale-110 transition"
                    >
                        <FaSignOutAlt />
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;