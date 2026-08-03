import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import { useTheme } from "../context/ThemeContext";
import "./Profile.css";

function Profile() {

    const navigate = useNavigate();
    const { theme } = useTheme();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {

        try {

            const token = localStorage.getItem("token");

            const profileRes = await api.get(
                "/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(profileRes.data);

            const postsRes = await api.get(
                `/users/${profileRes.data.id}/posts`
            );

            setPosts(postsRes.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                navigate("/");
            }

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <MainLayout>

                <div className={`profile-page ${theme}`}>
                    <h2>Loading Profile...</h2>
                </div>

            </MainLayout>

        );

    }

    return (

        <MainLayout>

            <div className={`profile-page ${theme}`}>

                {/* ================= PROFILE CARD ================= */}

                <div className="profile-card">

                    <div className="profile-header">

                        <img
                            src={
                                profile.profile_picture ||
                                `https://ui-avatars.com/api/?name=${profile.username}`
                            }
                            alt="Profile"
                            className="profile-image"
                        />

                        <div className="profile-details">

                            <div className="profile-top-row">

                                <h2>{profile.username}</h2>

                                <button
                                    className="edit-btn"
                                    onClick={() => navigate("/edit-profile")}
                                >
                                    Edit Profile
                                </button>

                            </div>

                            <p className="email">
                                {profile.email}
                            </p>

                            <p className="bio">
                                {profile.bio || "No bio available"}
                            </p>

                            <p className="joined">
                                Joined {new Date(profile.created_at).toLocaleDateString()}
                            </p>

                            <div className="stats">

                                <div className="stat">
                                    <h3>{profile.posts}</h3>
                                    <p>Posts</p>
                                </div>

                                <div className="stat">
                                    <h3>{profile.followers}</h3>
                                    <p>Followers</p>
                                </div>

                                <div className="stat">
                                    <h3>{profile.following}</h3>
                                    <p>Following</p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= POSTS ================= */}

                <div className="posts-section">

                    <h2>Posts ({posts.length})</h2>

                    {posts.length === 0 ? (

                        <div className="empty-posts">
                            No posts yet.
                        </div>

                    ) : (

                        <div className="posts-grid">

                            {posts.map((post) => (

                                <PostCard
                                    key={post.id}
                                    post={{
                                        ...post,
                                        user_id: profile.id,
                                        username: profile.username,
                                        profile_picture: profile.profile_picture,
                                        likes: post.likes || 0,
                                        comments: post.comments || 0,
                                        liked: false
                                    }}
                                    onDelete={(postId) =>
                                        setPosts(prev =>
                                            prev.filter(p => p.id !== postId)
                                        )
                                    }
                                />

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </MainLayout>

    );

}

export default Profile;