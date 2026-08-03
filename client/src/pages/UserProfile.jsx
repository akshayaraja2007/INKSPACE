import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import "./UserProfile.css";
import MainLayout from "../layouts/MainLayout";
function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        loadProfile();
    }, [id]);

    async function loadProfile() {
        setLoading(true);

        try {

            // Profile
            const profileRes = await api.get(`/users/${id}`);
            setProfile(profileRes.data);

            // Posts
            try {

                const postsRes = await api.get(`/users/${id}/posts`);

                setPosts(postsRes.data || []);

            } catch (err) {

                console.error("Posts Error:", err);

                setPosts([]);

            }

            // Follow Status
            try {

                const followRes = await api.get(
                    `/follows/status/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setIsFollowing(followRes.data.following);

            } catch (err) {

                console.error("Follow Error:", err);

                setIsFollowing(false);

            }

        } catch (err) {

            console.error(err);

            if (err.response?.status === 401) {
                navigate("/");
                return;
            }

            if (err.response?.status === 404) {
                setProfile(null);
            }

        } finally {

            setLoading(false);

        }
    }

    async function follow() {

        try {

            await api.post(
                `/follows/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsFollowing(true);

            setProfile((prev) => ({
                ...prev,
                followers: Number(prev.followers) + 1,
            }));

        } catch (err) {

            console.error("Follow Error:", err);

        }

    }

    async function unfollow() {

        try {

            await api.delete(
                `/follows/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsFollowing(false);

            setProfile((prev) => ({
                ...prev,
                followers: Math.max(
                    0,
                    Number(prev.followers) - 1
                ),
            }));

        } catch (err) {

            console.error("Unfollow Error:", err);

        }

    }

    if (loading) {
        return (
            <div className={`user-profile-page ${theme}`}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className={`user-profile-page ${theme}`}>
                <h2>User not found</h2>
            </div>
        );
    }

    return (<MainLayout>
        <div className={`user-profile-page ${theme}`}>

            <div className="profile-card">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <div className="profile-top">

                    <img
                        className="profile-image"
                        src={
                            profile.profile_picture
                                ? profile.profile_picture
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      profile.username
                                  )}`
                        }
                        alt={profile.username}
                    />

                    <div className="profile-info">

                        <h2>{profile.username}</h2>

                        <p>
                            {profile.bio || "No bio available"}
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

                        {isFollowing ? (
                            <button
                                className="follow-btn unfollow"
                                onClick={unfollow}
                            >
                                Unfollow
                            </button>
                        ) : (
                            <button
                                className="follow-btn"
                                onClick={follow}
                            >
                                Follow
                            </button>
                        )}

                    </div>

                </div>

            </div>

            <div className="posts-section">

                <h2>
                    Posts ({posts.length})
                </h2>

                {posts.length === 0 ? (

                    <div className="empty-posts">
                        No posts available.
                    </div>

                ) : (

                    <div className="posts-grid">

                        {posts.map((post) => (

                            <div
                                className="post-card"
                                key={post.id}
                            >

                                {post.image ? (

                                    <img
                                        className="post-image"
                                        src={post.image}
                                        alt="Post"
                                    />

                                ) : (

                                    <div className="text-post">
                                        {post.content}
                                    </div>

                                )}

                                <div className="post-footer">

                                    <p>{post.content}</p>

                                    <small>
                                        {new Date(
                                            post.created_at
                                        ).toLocaleString()}
                                    </small>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
        </MainLayout>
    );
}

export default UserProfile;