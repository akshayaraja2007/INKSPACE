import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import "./Notifications.css";
import MainLayout from "../layouts/MainLayout";
function Notifications() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [notifications,setNotifications]=useState([]);
  const [loading,setLoading]=useState(true);

  const token=localStorage.getItem("token");

  useEffect(()=>{loadNotifications();},[]);

  async function loadNotifications(){
    try{
      setLoading(true);
      const res=await api.get("/notifications",{
        headers:{Authorization:`Bearer ${token}`}
      });
      setNotifications(res.data);
    }catch(err){
      console.error(err);
      setNotifications([]);
    }finally{
      setLoading(false);
    }
  }

  async function markAsRead(id){
    try{
      await api.put(`/notifications/${id}`,{},{
        headers:{Authorization:`Bearer ${token}`}
      });

      setNotifications(prev=>
        prev.map(n=>n.id===id?{...n,is_read:true}:n)
      );
    }catch(err){
      console.error(err);
    }
  }

  async function markAllAsRead(){
    try{
      await api.put("/notifications/read-all",{},{
        headers:{Authorization:`Bearer ${token}`}
      });

      setNotifications(prev=>
        prev.map(n=>({...n,is_read:true}))
      );
    }catch(err){
      console.error(err);
    }
  }

  async function deleteNotification(id){
    try{
      await api.delete(`/notifications/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      });

      setNotifications(prev=>prev.filter(n=>n.id!==id));
    }catch(err){
      console.error(err);
    }
  }

  function openNotification(n){
    if(!n.is_read){
      markAsRead(n.id);
    }

    if(n.post_id){
      navigate(`/post/${n.post_id}`);
    }else{
      navigate(`/user/${n.sender_id}`);
    }
  }

  if(loading){
    return(
      <div className={`notifications-page ${theme}`}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return(<MainLayout>
    <div className={`notifications-page ${theme}`}>
      <div className="notifications-header">
        <h1>Notifications</h1>

        <button
          className="mark-all-btn"
          onClick={markAllAsRead}
        >
          Mark All Read
        </button>
      </div>

      {notifications.length===0?(
        <div className="empty-notifications">
          <h3>No notifications yet.</h3>
        </div>
      ):(
        <div className="notification-list">
          {notifications.map(n=>(
            <div
              key={n.id}
              className={`notification-card ${!n.is_read?"unread":""}`}
            >
              <div
                className="notification-content"
                onClick={()=>openNotification(n)}
              >
                <img
                  className="notification-avatar"
                  src={
                    n.profile_picture||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(n.username)}`
                  }
                  alt={n.username}
                />

                <div className="notification-info">
                  <h3>{n.username}</h3>
                  <p>{n.message}</p>
                  <small>{new Date(n.created_at).toLocaleString()}</small>
                </div>
              </div>

              <div className="notification-actions">
                {!n.is_read&&(
                  <button onClick={()=>markAsRead(n.id)}>
                    Read
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={()=>deleteNotification(n.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
}

export default Notifications;
