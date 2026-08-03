import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaImage, FaTimes } from "react-icons/fa";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import MainLayout from "../layouts/MainLayout";
function CreatePost() {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim() && !image) {
            alert("Post must contain text or image.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("content", content);

            if (image) {
                formData.append("image", image);
            }

            await api.post("/posts", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Post Created Successfully");

            // Clear form
            setContent("");
            setImage(null);
            setPreview(null);

            // Go back to Home
            navigate("/home");

        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to create post."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
    <MainLayout>
        <div
            className={`max-w-2xl mx-auto mt-8 rounded-2xl shadow-lg p-6 ${
                theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
            }`}
        >
            <h1 className="text-3xl font-bold mb-6">
                Create Post
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <textarea
                    rows="6"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full rounded-xl border p-4 resize-none outline-none ${
                        theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-black"
                    }`}
                />

                {preview && (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="rounded-xl max-h-96 w-full object-cover"
                        />

                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}

                <label
                    className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer ${
                        theme === "dark"
                            ? "border-gray-600"
                            : "border-gray-300"
                    }`}
                >
                    <FaImage className="text-xl" />
                    <span>
                        {image ? image.name : "Select Image"}
                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        hidden
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-semibold text-white ${
                        loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Posting..." : "Create Post"}
                </button>
            </form>
        </div>
        </MainLayout>
    );
}

export default CreatePost;