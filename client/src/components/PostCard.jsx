import { useState } from "react";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import Comments from "./Comments";

function PostCard({ post }) {
    const { theme } = useTheme();

    const [liked, setLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.likes);

    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(post.comments);

    const handleLike = async () => {
        const token = localStorage.getItem("token");

        try {
            if (liked) {
                await api.delete(`/likes/${post.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLiked(false);
                setLikes((prev) => prev - 1);
            } else {
                await api.post(
                    `/likes/${post.id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setLiked(true);
                setLikes((prev) => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            className={`rounded-2xl shadow-md p-5 mb-6 transition ${
                theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
            }`}
        >
            {/* User */}
            <div className="flex items-center gap-3 mb-4">
                {post.profile_picture ? (
                    <img
                        src={post.profile_picture}
                        alt={post.username}
                        className="w-12 h-12 rounded-full object-cover border"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                )}

                <div>
                    <h2 className="font-semibold text-lg">
                        {post.username}
                    </h2>

                    <p
                        className={`text-sm ${
                            theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                        }`}
                    >
                        {new Date(post.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Content */}
            {post.content && (
                <p className="mb-4 whitespace-pre-wrap">
                    {post.content}
                </p>
            )}

            {/* Image */}
            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-xl object-cover max-h-[500px] mb-4"
                />
            )}

            {/* Actions */}
            <div
                className={`flex items-center gap-8 pt-3 border-t ${
                    theme === "dark"
                        ? "border-gray-700"
                        : "border-gray-200"
                }`}
            >
                {/* Like */}
                <button
                    onClick={handleLike}
                    className="flex items-center gap-2 hover:text-red-500 transition"
                >
                    {liked ? (
                        <FaHeart className="text-red-500 text-xl" />
                    ) : (
                        <FaRegHeart className="text-xl" />
                    )}

                    <span>{likes}</span>
                </button>

                {/* Comment */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 hover:text-blue-500 transition"
                >
                    <FaComment className="text-xl" />
                    <span>{commentCount}</span>
                </button>
            </div>

            {/* Comments */}
            {showComments && (
                <Comments
                    postId={post.id}
                    commentCount={commentCount}
                    setCommentCount={setCommentCount}
                />
            )}
        </div>
    );
}

export default PostCard;