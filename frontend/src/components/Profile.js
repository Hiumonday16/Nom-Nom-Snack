import React, { useState, useRef } from 'react';
import styles from './Profile.module.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const hasFetched = useRef(false);

  // Immediately invoked async function to fetch profile data on mount
  (async () => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login first');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          setMessage('');
        } else {
          setMessage(data.message || 'Failed to load profile');
        }
      } catch (error) {
        setMessage(`Network error occurred: ${error.message}. Please ensure the backend is running on http://localhost:5000.`);
      }
    }
  })();

  return (
    <div className={styles.profileContainer}>
      {user ? (
        <div className={styles.profileCard}>
          <h2>Profile</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Postal Code:</strong> {user.postalCode}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default Profile;