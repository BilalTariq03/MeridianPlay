import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconArrowLeft, IconFlame } from '@tabler/icons-react';
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
  const location = useLocation();

  const goBack = () => {
    const back = location.pathname.replace('/play/', '/games/');
    if (back !== location.pathname) navigate(back);
    else navigate(-1);
  };

  useEffect(() => {
    document.title = `MeridianPlay · ${gameTitle}`;
  }, [gameTitle]);

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
        <button className={styles.backBtn} onClick={goBack}><IconArrowLeft size={16} /></button>
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
          <IconFlame size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Streak <span className={styles.streakNum}>{streak}</span>
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
        <div className={styles.card}>
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
    </div>
  );
}