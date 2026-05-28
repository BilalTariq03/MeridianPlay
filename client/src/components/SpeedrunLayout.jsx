import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import styles from './SpeedrunLayout.module.css';

const KEYS = ['A', 'B', 'C', 'D'];

export default function SpeedrunLayout({
  question, score, correct, total,
  timeLeft, timeLimit, selected,
  status, onAnswer, renderQuestion,
  gameTitle = 'Speedrun',
}) {
  const navigate  = useNavigate();
  const location  = useLocation();

  const goBack = () => {
    const back = location.pathname.replace('/play/', '/games/');
    if (back !== location.pathname) navigate(back);
    else navigate(-1);
  };

  useEffect(() => {
    document.title = `MeridianPlay · ${gameTitle}`;
  }, [gameTitle]);

  const fillWidth  = `${(timeLeft / timeLimit) * 100}%`;
  const isLow      = timeLeft <= 10;
  const accuracy   = total > 0 ? Math.round((correct / total) * 100) : 0;
  const correct_   = question?.answer;

  const getOptionClass = (option) => {
    if (status !== 'feedback') return styles.option;
    if (option === correct_)  return `${styles.option} ${styles.optionCorrect}`;
    if (option === selected)  return `${styles.option} ${styles.optionWrong}`;
    return styles.option;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
  };

  return (
    <div className={styles.page}>

      {/* Navbar */}
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={goBack}><IconArrowLeft size={16} /></button>
        <span className={styles.navTitle}>{gameTitle} · Speedrun</span>
        <div className={styles.navStats}>
          <span className={styles.navCorrect}>{correct} correct</span>
          <span className={styles.navScore}>{score}</span>
        </div>
      </nav>

      {/* Global timer bar */}
      <div className={styles.timerSection}>
        <div className={styles.timerTop}>
          <span className={styles.timerLabel}>Time remaining</span>
          <span className={`${styles.timerNum} ${isLow ? styles.timerNumLow : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className={styles.timerTrack}>
          <div
            className={`${styles.timerFill} ${isLow ? styles.timerFillLow : ''}`}
            style={{ width: fillWidth }}
          />
        </div>
      </div>

      {/* Stats strip */}
      <div className={styles.statsStrip}>
        <span className={styles.statItem}>
          Answered <strong>{total}</strong>
        </span>
        <span className={styles.statItem}>
          Accuracy <strong>{accuracy}%</strong>
        </span>
        <span className={styles.statItem}>
          Score <strong className={styles.accentNum}>{score}</strong>
        </span>
      </div>

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