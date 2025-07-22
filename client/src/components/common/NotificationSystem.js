import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Simulate real-time notifications
        const notificationTypes = [
            { type: 'order', message: 'New order received!', icon: '🛒' },
            { type: 'user', message: 'New user registered!', icon: '👤' },
            { type: 'product', message: 'Product running low in stock!', icon: '📦' },
            { type: 'sale', message: 'Flash sale started!', icon: '🔥' }
        ];

        const interval = setInterval(() => {
            const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
            const newNotification = {
                id: Date.now(),
                ...randomNotification,
                timestamp: new Date().toLocaleTimeString()
            };

            setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        }, 15000); // New notification every 15 seconds

        return () => clearInterval(interval);
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <div className="notification-system">
            <div className="notification-bell">
                <FaBell />
                {notifications.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                )}
            </div>
            
            <div className="notifications-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                        <span className="notification-icon">{notification.icon}</span>
                        <div className="notification-content">
                            <p>{notification.message}</p>
                            <span className="notification-time">{notification.timestamp}</span>
                        </div>
                        <button 
                            onClick={() => removeNotification(notification.id)}
                            className="notification-close"
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationSystem;
