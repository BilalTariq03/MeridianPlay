import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconWorld } from '@tabler/icons-react';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'MeridianPlay · 404';
  }, []);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <div className={styles.logoIcon}>
            <IconWorld size={18} color="#000" />
          </div>
          <span className={styles.logoName}>TRIVIA</span>
        </div>
        <span className={styles.tagline}>Geography · Gamified</span>
      </nav>

      <div className={styles.body}>
        <p className={styles.code}>404</p>
        <p className={styles.message}>Page not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  );
}
