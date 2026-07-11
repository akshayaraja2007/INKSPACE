import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Notifications from "./pages/Notifications";
import CreatePost from "./pages/CreatePost";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/explore"
                element={
                    <ProtectedRoute>
                        <Explore />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/search"
                element={
                    <ProtectedRoute>
                        <Search />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/edit-profile"
                element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-post"
                element={
                    <ProtectedRoute>
                        <CreatePost />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;