import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const foodImages = [
  'https://images.getrecipekit.com/20230813061131-andy-20cooks-20-20roast-20pork-20banh-20mi.jpg?aspect_ratio=4:3&quality=90&',
  'https://img.taste.com.au/SGF3qTIo/taste/2016/11/50-slow-cooker-dinners-under-500-calories-108488-2.jpeg',
  'https://takestwoeggs.com/wp-content/uploads/2022/05/Che-Thai-Takestwoeggs-Final-Photography-sq.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVg2LLY4NfyHDBzekgbHfdbGJZV0inSWW37Q&s',
];

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}>
        <div className={styles.imageGrid}>
          {foodImages.map((image, index) => (
            <img key={index} src={image} alt={`Food ${index + 1}`} className={styles.foodImage} />
          ))}
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;