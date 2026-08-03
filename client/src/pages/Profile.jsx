import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import { useTheme } from "../context/ThemeContext";
import "./Profile.css";
import MainLayout from "../layouts/MainLayout";
function Profile() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const profileRes = await api.get("/users/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
    };

    if (loading) {
        return (
            <div className={`profile-page ${theme}`}>
                <h2>Loading Profile...</h2>
            </div>
        );
    }

    return (
         <MainLayout>
        <div className={`profile-page ${theme}`}>

            <div className="profile-card">

                <div className="profile-top">

                    <img
                        src={
                            profile.profile_picture ||
                            "https://ui-avatars.com/api/?name=" +
                            profile.username
                        }
                        alt="Profile"
                        className="profile-image"
                    />

                    <div className="profile-info">

                        <h2>{profile.username}</h2>

                        <p>{profile.email}</p>

                        <p className="bio">
                            {profile.bio || "No bio available"}
                        </p>

                        <p className="joined">
                            Joined :
                            {" "}
                            {new Date(
                                profile.created_at
                            ).toLocaleDateString()}
                        </p>

                        <button
                            className="edit-btn"
                            onClick={() =>
                                navigate("/edit-profile")
                            }
                        >
                            Edit Profile
                        </button>

                    </div>

                </div>

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
                                    setPosts((prev) =>
                                        prev.filter((p) => p.id !== postId)
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