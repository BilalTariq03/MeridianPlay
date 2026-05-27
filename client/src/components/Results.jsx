import { useNavigate } from 'react-router-dom';
import styles from './Results.module.css';

const getMessage = (percent) => {
  if (percent === 100) return { text: 'Perfect score!',    emoji: '🏆' };
  if (percent >= 80)   return { text: 'Excellent!',        emoji: '🎯' };
  if (percent >= 60)   return { text: 'Good job!',         emoji: '👍' };
  if (percent >= 40)   return { text: 'Keep practicing!',  emoji: '📚' };
  return                      { text: 'Better luck next time!', emoji: '💪' };
};

export default function Results({ score, total, history = [], gameTitle = 'Quiz' }) {
  const navigate  = useNavigate();
  const percent   = Math.round((score / total) * 100);
  const accuracy  = percent;
  const avgTime   = history.length > 0
    ? (history.reduce((sum, h) => sum + (h.timeSpent || 0), 0) / history.length).toFixed(1)
    : null;
  const streak    = getBestStreak(history);
  const msg       = getMessage(percent);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.emoji}>{msg.emoji}</p>
          <h1 className={styles.title}>{msg.text}</h1>
          <p className={styles.subtitle}>{gameTitle} · Classic</p>
        </div>

        {/* Stat cards */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Score</p>
            <p className={styles.statValue}>{score}<span className={styles.statTotal}>/{total}</span></p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Accuracy</p>
            <p className={styles.statValue}>{accuracy}<span className={styles.statTotal}>%</span></p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statLabel}>Best Streak</p>
            <p className={styles.statValue}>{streak}</p>
          </div>
          {avgTime && (
            <div className={styles.stat}>
              <p className={styles.statLabel}>Avg Time</p>
              <p className={styles.statValue}>{avgTime}<span className={styles.statTotal}>s</span></p>
            </div>
          )}
        </div>

        {/* Round by round */}
        {history.length > 0 && (
          <div className={styles.breakdown}>
            <p className={styles.breakdownTitle}>Round by round</p>
            <div className={styles.rows}>
              {history.map((h, i) => (
                <div key={i} className={`${styles.row} ${h.correct ? styles.rowCorrect : styles.rowWrong}`}>
                  <div className={styles.rowLeft}>
                    <span className={`${styles.tick} ${h.correct ? styles.tickCorrect : styles.tickWrong}`}>
                      {h.correct ? '✓' : '✗'}
                    </span>
                    <span className={styles.rowNum}>Q{i + 1}</span>
                    <span className={styles.rowAnswer}>{h.answer}</span>
                  </div>
                  <div className={styles.rowRight}>
                    {!h.correct && h.chosen && (
                      <span className={styles.rowChosen}>you said: {h.chosen}</span>
                    )}
                    {!h.correct && !h.chosen && (
                      <span className={styles.rowChosen}>timed out</span>
                    )}
                    {h.timeSpent !== null && (
                      <span className={styles.rowTime}>{h.timeSpent}s</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className={styles.buttons}>
          <button className={styles.btnPrimary} onClick={() => window.location.reload()}>
            Play Again
          </button>
          <button className={styles.btnGhost} onClick={() => navigate('/')}>
            Home
          </button>
        </div>

      </div>
    </div>
  );
}

function getBestStreak(history) {
  let best = 0;
  let current = 0;
  for (const h of history) {
    if (h.correct) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}