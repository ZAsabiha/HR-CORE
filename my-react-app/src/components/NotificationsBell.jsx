import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const NotificationsBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/leave/notifications", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/leave/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              fontSize: "12px",
              padding: "2px 6px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            width: "300px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "8px" }}>
            {notifications.length === 0 ? (
              <li style={{ padding: "8px", textAlign: "center", color: "#666" }}>
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    background: n.isRead ? "#f9f9f9" : "#e0f2fe",
                    cursor: "pointer",
                  }}
                  onClick={() => markAsRead(n.id)}
                >
                  <p style={{ margin: 0 }}>{n.message}</p>
                  <small style={{ color: "#666" }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
