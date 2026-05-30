import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import styles from './HigherLowerLayout.module.css';

const formatPop = (n) => {
  if (n == null) return '?';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
};

export default function HigherLowerLayout({
  question, index, total, score,
  timeLeft, status,
  onAnswer, gameTitle = 'Higher or Lower',
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

  const isLow     = questionTime > 0 && timeLeft <= 3;
  const fillWidth = questionTime > 0 ? `${(timeLeft / questionTime) * 100}%` : '100%';

  if (!question) return null;

  const { left, right } = question;
  const isFeedback = status === 'feedback';
  const winnerSide = isFeedback
    ? (left.population > right.population ? 'left' : 'right')
    : null;

  const renderHalf = (country, isLeft) => {
    const side     = isLeft ? 'left' : 'right';
    const isWinner = isFeedback && side === winnerSide;
    const isLoser  = isFeedback && !isWinner;
    return (
      <button
        className={`${styles.half} ${isLeft ? styles.halfLeft : ''}`}
        onClick={() => onAnswer(side)}
        disabled={isFeedback}
      >
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${country.flag})` }}
        />
        <div className={`${styles.overlay}${isWinner ? ` ${styles.overlayWin}` : ''}${isLoser ? ` ${styles.overlayLose}` : ''}`} />
        <div className={styles.content}>
          <h2 className={styles.name}>{country.name}</h2>
          {isFeedback ? (
            <>
              <p className={isWinner ? styles.population : styles.populationDim}>{formatPop(country.population)}</p>
              <span className={isWinner ? styles.iconWin : styles.iconLose}>
                {isWinner
                  ? <IconCheck size={36} strokeWidth={2.5} />
                  : <IconX    size={36} strokeWidth={2.5} />
                }
              </span>
            </>
          ) : (
            <p className={styles.hint}>Higher?</p>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className={styles.page}>

      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={goBack}>
          <IconArrowLeft size={16} />
        </button>
        <span className={styles.navTitle}>{gameTitle}</span>
        <span className={styles.navScore}>
          Score <span className={styles.navScoreVal}>{score}</span>
        </span>
      </nav>

      <div className={styles.progressRow}>
        {Array.from({ length: total }).map((_, i) => {
          let cls = styles.dot;
          if (i < index)   cls = `${styles.dot} ${styles.dotDone}`;
          if (i === index) cls = `${styles.dot} ${styles.dotCurrent}`;
          return <div key={i} className={cls} />;
        })}
      </div>

      {questionTime > 0 && (
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
      )}

      <div className={styles.halves}>
        {renderHalf(left, true)}
        <div className={styles.divider}>
          <span className={styles.vsBadge}>VS</span>
        </div>
        {renderHalf(right, false)}
      </div>

    </div>
  );
}
