import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

function Comments({ postId, commentCount, setCommentCount }) {
    const { theme } = useTheme();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const currentUser = token ? jwtDecode(token) : null;

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        setLoading(true);

        try {
            const res = await api.get(`/comments/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setComments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;

        try {
            await api.post(
                `/comments/${postId}`,
                {
                    comment: newComment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNewComment("");

            await fetchComments();

            if (setCommentCount) {
                setCommentCount((prev) => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setComments((prev) =>
                prev.filter((c) => c.id !== commentId)
            );

            if (setCommentCount) {
                setCommentCount((prev) => prev - 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            className={`mt-5 border-t pt-4 ${
                theme === "dark"
                    ? "border-gray-700"
                    : "border-gray-300"
            }`}
        >
            <h3 className="font-semibold mb-3">
                Comments ({commentCount})
            </h3>

            {/* Add Comment */}

            <div className="flex gap-2 mb-5">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addComment();
                        }
                    }}
                    className={`flex-1 rounded-lg border px-3 py-2 outline-none ${
                        theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                    }`}
                />

                <button
                    onClick={addComment}
                    disabled={!newComment.trim()}
                    className={`px-4 rounded-lg text-white transition ${
                        newComment.trim()
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Post
                </button>
            </div>

            {/* Loading */}

            {loading && (
                <p
                    className={
                        theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                    }
                >
                    Loading...
                </p>
            )}

            {/* Empty */}

            {!loading && comments.length === 0 && (
                <p
                    className={
                        theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                    }
                >
                    No comments yet. Be the first to comment.
                </p>
            )}

            {/* Comment List */}

            {!loading &&
                comments.map((item) => (
                    <div
                        key={item.id}
                        className={`flex justify-between items-start rounded-lg p-3 mb-3 ${
                            theme === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-100"
                        }`}
                    >
                        <div>
                            <h4 className="font-semibold">
                                {item.username}
                            </h4>

                            <p>{item.comment}</p>

                            <small
                                className={
                                    theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                }
                            >
                                {new Date(
                                    item.created_at
                                ).toLocaleString([], {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </small>
                        </div>

                        {currentUser &&
                            currentUser.username === item.username && (
                                <button
                                    onClick={() =>
                                        deleteComment(item.id)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            )}
                    </div>
                ))}
        </div>
    );
}

export default Comments;