import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import "./Explore.css";
import MainLayout from "../layouts/MainLayout";
function Explore() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const res = await api.get("/posts/explore");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={`explore-page ${theme}`}>
        <h2>Loading posts...</h2>
      </div>
    );
  }

  return (<MainLayout>
    <div className={`explore-page ${theme}`}>
      <div className="explore-header">
        <h1>Explore</h1>
        <button className="refresh-btn" onClick={loadPosts}>
          Refresh
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts found.</h3>
        </div>
      ) : (
        <div className="explore-grid">
          {posts.map((post) => (
            <div className="explore-card" key={post.id}>
              <div
                className="card-header"
                onClick={() => navigate(`/user/${post.user_id}`)}
              >
                <img
                  className="avatar"
                  src={
                    post.profile_picture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      post.username
                    )}`
                  }
                  alt={post.username}
                />

                <div>
                  <h3>{post.username}</h3>
                  <small>
                    {new Date(post.created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>

              {post.image ? (
                <img
                  className="post-image"
                  src={post.image}
                  alt=""
                />
              ) : (
                <div className="text-post">
                  {post.content}
                </div>
              )}

              <div className="card-body">
                <p>{post.content}</p>
              </div>

              <div className="card-footer">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
}

export default Explore;
