import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import "./EditProfile.css";
import MainLayout from "../layouts/MainLayout";
function EditProfile() {

    const navigate = useNavigate();
    const { theme } = useTheme();

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/users/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsername(res.data.username);
            setBio(res.data.bio || "");
            setCurrentImage(res.data.profile_picture);

        } catch (err) {

            console.log(err);

        }

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("username", username);
            formData.append("bio", bio);

            if (selectedImage) {

                formData.append(
                    "profile_picture",
                    selectedImage
                );

            }

            await api.put(
                "/users/profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Profile Updated Successfully");

            navigate("/profile");

        } catch (err) {

            console.log(err);
            alert("Failed to update profile");

        } finally {

            setLoading(false);

        }

    };

    return (
<MainLayout>
        <div className={`edit-profile-page ${theme}`}>

            <form
                className="edit-profile-card"
                onSubmit={handleSubmit}
            >

                <h2>Edit Profile</h2>

                <div className="image-section">

                    <img
                        src={
                            preview ||
                            currentImage ||
                            `https://ui-avatars.com/api/?name=${username}`
                        }
                        alt="Profile"
                        className="profile-preview"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                </div>

                <label>Username</label>

                <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    required
                />

                <label>Bio</label>

                <textarea
                    rows="5"
                    value={bio}
                    onChange={(e) =>
                        setBio(e.target.value)
                    }
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {
                        loading
                            ? "Saving..."
                            : "Save Changes"
                    }
                </button>

            </form>

        </div>
</MainLayout>
    );

}

export default EditProfile;