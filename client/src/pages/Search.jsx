import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import "./Search.css";

function Search() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  async function searchUsers() {
    try {
      setLoading(true);
      const res = await api.get(`/users/search?username=${encodeURIComponent(query)}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`search-page ${theme}`}>
      <div className="search-container">
        <h2>Search Users</h2>

        <input
          className="search-input"
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p>Searching...</p>}

        {!loading && query && users.length === 0 && (
          <div className="empty-results">No users found.</div>
        )}

        <div className="user-list">
          {users.map((user) => (
            <div
              className="user-card"
              key={user.id}
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <img
                className="user-avatar"
                src={
                  user.profile_picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`
                }
                alt={user.username}
              />

              <div className="user-details">
                <h3>{user.username}</h3>
                <p>{user.bio || "No bio available"}</p>
              </div>

              <button
                className="view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${user.id}`);
                }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
