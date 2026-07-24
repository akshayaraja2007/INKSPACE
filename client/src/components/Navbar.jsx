import { useNavigate } from "react-router-dom";
import {
    FaMoon,
    FaSun,
    FaUserCircle,
    FaSignOutAlt,
    FaPlus
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
            className={`sticky top-0 z-50 shadow-lg ${
                theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
            }`}
        >
            <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">

                <h1
                    className="text-3xl font-bold text-blue-600 cursor-pointer"
                    onClick={() => navigate("/home")}
                >
                    InkSpace
                </h1>

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate("/create-post")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        <FaPlus />
                        <span className="hidden md:inline">
                            Create Post
                        </span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="text-xl hover:scale-110 transition"
                    >
                        {theme === "dark" ? <FaSun /> : <FaMoon />}
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                        className="text-2xl hover:text-blue-600 transition"
                    >
                        <FaUserCircle />
                    </button>

                    <button
                        onClick={logout}
                        className="text-xl text-red-500 hover:scale-110 transition"
                    >
                        <FaSignOutAlt />
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;