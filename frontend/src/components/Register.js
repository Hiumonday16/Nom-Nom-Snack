import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

// Sample food images
const foodImages = [
  'https://images.getrecipekit.com/20230813061131-andy-20cooks-20-20roast-20pork-20banh-20mi.jpg?aspect_ratio=4:3&quality=90&',
  'https://img.taste.com.au/SGF3qTIo/taste/2016/11/50-slow-cooker-dinners-under-500-calories-108488-2.jpeg',
  'https://takestwoeggs.com/wp-content/uploads/2022/05/Che-Thai-Takestwoeggs-Final-Photography-sq.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVg2LLY4NfyHDBzekgbHfdbGJZV0inSWW37Q&s',
];

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim() || !address.trim() || !postalCode.trim() || !phone.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, address, postalCode, phone }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Give user time to see success message
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.imageSection}>
        <div className={styles.imageGrid}>
          {foodImages.map((image, index) => (
            <img key={index} src={image} alt={`Food ${index + 1}`} className={styles.foodImage} />
          ))}
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2>Register</h2>
          {message && (
            <div 
              className={`${styles.message} ${
                message.includes('successful') ? styles.success : styles.error
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;