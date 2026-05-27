import { useNavigate } from 'react-router-dom';
import styles from './QuizLayout.module.css';

const KEYS = ['A', 'B', 'C', 'D'];

export default function QuizLayout({
  question, index, total, score,
  timeLeft, selected, status,
  onAnswer, renderQuestion,
  gameTitle = 'Quiz',
  layout = 'default',
}) {
  const navigate  = useNavigate();
  const isLow     = timeLeft <= 3;
  const fillWidth = `${(timeLeft / 10) * 100}%`;
  const correct   = question?.answer;

  const getOptionClass = (option) => {
    if (status !== 'feedback') return styles.option;
    if (option === correct)  return `${styles.option} ${styles.optionCorrect}`;
    if (option === selected) return `${styles.option} ${styles.optionWrong}`;
    return styles.option;
  };

  const timerBar = (
    <div className={styles.timerRow}>
      <div className={styles.timerTrack}>
        <div
          className={`${styles.timerFill} ${isLow ? styles.timerFillLow : ''}`}
          style={{ width: fillWidth }}
        />
      </div>
      <span className={`${styles.timerNum} ${isLow ? styles.timerNumLow : ''}`}>
        {timeLeft}
      </span>
    </div>
  );

  const optionButtons = (vertical = false) => (
    <div className={vertical ? styles.splitOptions : styles.options}>
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
  );

  return (
    <div className={styles.page}>

      {/* Navbar */}
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>
        <span className={styles.navTitle}>{gameTitle}</span>
        <span className={styles.navScore}>
          Score <span className={styles.navScoreVal}>{score}</span>
        </span>
      </nav>

      {/* Progress dots */}
      <div className={styles.progressRow}>
        {Array.from({ length: total }).map((_, i) => {
          let cls = styles.dot;
          if (i < index)   cls = `${styles.dot} ${styles.dotDone}`;
          if (i === index) cls = `${styles.dot} ${styles.dotCurrent}`;
          return <div key={i} className={cls} />;
        })}
      </div>

      {/* SPLIT LAYOUT — map left, options right */}
      {layout === 'split' ? (
        <div className={styles.splitBody}>
          <div className={styles.splitLeft}>
            {question && renderQuestion(question)}
          </div>

          <div className={styles.splitRight}>
            {timerBar}
            <p style={{ fontSize: '13px', color: 'var(--text-400)' }}>
              Which country is highlighted?
            </p>
            {optionButtons(true)}
            <div className={styles.splitScore}>
              Score <span className={styles.splitScoreVal}>{score}</span> · 
              Question {index + 1} of {total}
            </div>
          </div>
        </div>

      ) : (
        /* DEFAULT LAYOUT — centered column */
        <div className={styles.body}>
          {timerBar}
          <div className={styles.questionArea}>
            {question && renderQuestion(question)}
          </div>
          {optionButtons(false)}
        </div>
      )}

    </div>
  );
}