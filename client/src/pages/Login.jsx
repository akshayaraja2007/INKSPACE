import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const res = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);

            navigate("/home");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Login Failed"
            );

        }

        setLoading(false);

    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-5">

            <div className="bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-md p-8">

                <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
                    InkSpace
                </h1>

                <p className="text-center text-gray-600 mb-8">
                    Welcome Back
                </p>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <div className="relative">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="absolute right-4 top-3"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                           {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                    </div>

                    {

                        error && (

                            <p className="text-red-500 text-center">

                                {error}

                            </p>

                        )

                    }

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                    >

                        {

                            loading
                                ? "Logging In..."
                                : "Login"

                        }

                    </button>

                </form>

                <p className="text-center mt-6">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-600 ml-2 font-semibold"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;