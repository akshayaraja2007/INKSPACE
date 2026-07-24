import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/axios";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (!username || !email || !password) {
            setError("Please fill all fields.");
            return;
        }

        try {

            setLoading(true);

            const res = await api.post("/auth/register", {
                username,
                email,
                password
            });

            alert(res.data.message || "Registration Successful");

            navigate("/");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Registration Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-5">

            <div className="bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-md p-8">

                <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
                    InkSpace
                </h1>

                <p className="text-center text-gray-600 mb-8">
                    Create Account
                </p>

                <form
                    onSubmit={handleRegister}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="relative">

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="absolute right-4 top-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                    </div>

                    {error && (

                        <p className="text-red-500 text-center">
                            {error}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="text-center mt-6">

                    Already have an account?

                    <Link
                        to="/"
                        className="text-blue-600 ml-2 font-semibold"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;