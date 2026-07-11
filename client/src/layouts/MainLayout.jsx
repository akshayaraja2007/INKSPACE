import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import MobileBottomNav from "../components/MobileBottomNav";
function MainLayout({ children }) {

    const { theme } = useTheme();

 return (

    <div
        className={
            theme === "dark"
                ? "bg-gray-900 text-white min-h-screen"
                : "bg-gray-100 text-black min-h-screen"
        }
    >

        <Navbar />

        <div className="flex">

            <Sidebar />

            <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">

                {children}

            </main>

        </div>

        <MobileBottomNav />

    </div>

);

}

export default MainLayout;