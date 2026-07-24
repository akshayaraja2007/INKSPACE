import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";

function MainLayout({ children }) {

    const { theme } = useTheme();

    return (

        <div
            className={`min-h-screen ${
                theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-black"
            }`}
        >

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="flex-1 p-6 pb-24 md:pb-6">

                    {children}

                </main>

            </div>

            <MobileBottomNav />

        </div>

    );

}

export default MainLayout;