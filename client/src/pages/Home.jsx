import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/posts/feed", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPosts(res.data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message || "Failed to load feed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto px-4 py-6">

                <h1 className="text-3xl font-bold mb-6">
                    Home Feed
                </h1>

                {loading && (
                    <div className="text-center text-lg">
                        Loading posts...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500">
                        {error}
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="text-center text-gray-500">
                        No posts available.
                    </div>
                )}

                {!loading &&
                    !error &&
                    posts.map((post) => (
    <PostCard
        key={post.id}
        post={post}
        onDelete={() =>
            setPosts((prev) =>
                prev.filter((p) => p.id !== post.id)
            )
        }
    />
))}
            </div>
        </MainLayout>
    );
}

export default Home;