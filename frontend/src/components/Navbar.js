import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link to="/">
          <img src="/logo.png" alt="Nom Nom Snacks Logo" className={styles.logo} />
        </Link>
        <span>Nom Nom Snacks</span>
      </div>
      <div className={styles.navbarRight}>
        {token ? (
          <>
            <Link to="/profile" className={styles.accountButton}>Account</Link>
            <button onClick={handleLogout} className={styles.navButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" className={styles.navLink}>Register</Link>
            <Link to="/login" className={styles.navLink}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;