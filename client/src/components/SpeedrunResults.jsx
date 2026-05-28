import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBolt } from '@tabler/icons-react';
import styles from './SpeedrunResults.module.css';

export default function SpeedrunResults({ score, correct, total, timeLimit }) {
  const navigate  = useNavigate();

  useEffect(() => { document.title = 'MeridianPlay · Results'; }, []);
  const accuracy  = total > 0 ? Math.round((correct / total) * 100) : 0;
  const perMinute = total > 0
    ? Math.round((correct / timeLimit) * 60)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}><IconBolt size={48} /></div>
        <h1 className={styles.title}>Time's up!</h1>
        <p className={styles.subtitle}>Here's how you did</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Score</p>
            <p className={styles.statValue}>{score}</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Correct</p>
            <p className={styles.statValueGreen}>{correct}</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Accuracy</p>
            <p className={styles.statValue}>{accuracy}%</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Per minute</p>
            <p className={styles.statValue}>{perMinute}</p>
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.btnPrimary}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            className={styles.btnGhost}
            onClick={() => navigate('/')}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}