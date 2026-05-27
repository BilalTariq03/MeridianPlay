import { useNavigate } from 'react-router-dom';
import styles from './EndlessResults.module.css';

export default function EndlessResults({ score, streak, best, completed }) {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.icon}>{completed ? '🏆' : '💀'}</p>
        <h1 className={styles.title}>
          {completed ? 'You beat it!' : 'Game Over'}
        </h1>
        <p className={styles.subtitle}>
          {completed
            ? 'You guessed for every single country. Touch some grass twin.'
            : `Your streak ended at ${streak}`
          }
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Score</p>
            <p className={styles.statValue}>{score}</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Best Streak</p>
            <p className={styles.statValueStreak}>{best}</p>
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.btnPrimary} onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className={styles.btnGhost} onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}