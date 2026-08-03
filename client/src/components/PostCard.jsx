import { useState } from "react";
import {
    FaHeart,
    FaRegHeart,
    FaComment,
    FaTrash
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import Comments from "./Comments";

function PostCard({ post, onDelete }) {

    const { theme } = useTheme();

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    const isOwner =
        currentUser &&
        currentUser.id === post.user_id;

    const [liked, setLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.likes);

    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(post.comments);

    const handleLike = async () => {

        try {

            if (liked) {

                await api.delete(
                    `/likes/${post.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setLiked(false);
                setLikes(prev => prev - 1);

            } else {

                await api.post(
                    `/likes/${post.id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setLiked(true);
                setLikes(prev => prev + 1);

            }

        } catch (err) {

            console.error(err);

        }

    };

    const handleDelete = async () => {

        const ok = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!ok) return;

        try {

            await api.delete(
                `/posts/${post.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Post deleted successfully.");

            if (onDelete) {
                onDelete(post.id);
            }

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to delete post."
            );

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

            <div className="flex justify-between items-start">

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

                {isOwner && (

                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete Post"
                    >
                        <FaTrash size={18} />
                    </button>

                )}

            </div>

            {post.content && (

                <p className="mb-4 whitespace-pre-wrap">
                    {post.content}
                </p>

            )}

            {post.image && (

                <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-xl object-cover max-h-[500px] mb-4"
                />

            )}

            <div
                className={`flex items-center gap-8 pt-3 border-t ${
                    theme === "dark"
                        ? "border-gray-700"
                        : "border-gray-200"
                }`}
            >

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

                <button
                    onClick={() =>
                        setShowComments(!showComments)
                    }
                    className="flex items-center gap-2 hover:text-blue-500 transition"
                >

                    <FaComment className="text-xl" />

                    <span>{commentCount}</span>

                </button>

            </div>

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