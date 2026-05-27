import { useNavigate } from 'react-router-dom';
import styles from './EndlessLayout.module.css';

const KEYS = ['A', 'B', 'C', 'D'];

export default function EndlessLayout({
  question, score, streak, best,
  multiplier, timeLeft, selected,
  status, onAnswer, renderQuestion,
  gameTitle = 'Endless',
  questionTime = 10,
}) {
  const navigate = useNavigate();
  const isLow    = questionTime > 0 && timeLeft <= 3;
  const correct  = question?.answer;

  const getOptionClass = (option) => {
    if (status !== 'feedback') return styles.option;
    if (option === correct)    return `${styles.option} ${styles.optionCorrect}`;
    if (option === selected)   return `${styles.option} ${styles.optionWrong}`;
    return styles.option;
  };

  return (
    <div className={styles.page}>

      {/* Navbar */}
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>
        <span className={styles.navTitle}>{gameTitle} · Endless</span>
        <div className={styles.navStats}>
          {multiplier > 1 && (
            <span className={styles.multiplier}>×{multiplier}</span>
          )}
          <span className={styles.navScore}>{score}</span>
        </div>
      </nav>

      {/* Streak bar */}
      <div className={styles.streakBar}>
        <span className={styles.streakLabel}>
          🔥 Streak <span className={styles.streakNum}>{streak}</span>
        </span>
        <span className={styles.bestLabel}>
          Best <span className={styles.bestNum}>{best}</span>
        </span>
      </div>

      {/* Progress dots — show last 10 */}
      {questionTime > 0 && (
        <div className={styles.timerRow}>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${isLow ? styles.timerFillLow : ''}`}
              style={{ width: `${(timeLeft / questionTime) * 100}%` }}
            />
          </div>
          <span className={`${styles.timerNum} ${isLow ? styles.timerNumLow : ''}`}>
            {timeLeft}
          </span>
        </div>
      )}

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.questionArea}>
          {question && renderQuestion(question)}
        </div>

        <div className={styles.options}>
          {question?.options.map((option, i) => (
            <button
              key={option}
              className={getOptionClass(option)}
              onClick={() => onAnswer(option)}
              disabled={status === 'feedback'}
            >
              <span className={styles.optionKey}>{KEYS[i]}</span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}