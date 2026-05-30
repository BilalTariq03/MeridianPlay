import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconFlag2, IconBuildingBank,
  IconMap2, IconCoin,
  IconArrowLeft, IconArrowRight,
  IconWorld,
  IconLanguage,
  IconArrowsUpDown
} from '@tabler/icons-react';
import games from '../config/games.config';
import styles from './GameSelect.module.css';

const ICON_MAP = {
  'flag':          IconFlag2,
  'building-bank': IconBuildingBank,
  'map-2':         IconMap2,
  'coin':          IconCoin,
  'language':      IconLanguage,
  'world':         IconWorld, 
  'arrows-up-down': IconArrowsUpDown,
};

const MODES = [
  {
    id:    'classic',
    name:  'Classic',
    desc:  'Fixed questions, per-question timer',
    color: '#22C55E',
  },
  {
    id:    'endless',
    name:  'Endless',
    desc:  'Play until you get one wrong',
    color: '#F59E0B',
  },
  {
    id:    'speedrun',
    name:  'Speedrun',
    desc:  'Score as high as possible in time',
    color: '#EF4444',
  },
];

const DIFFICULTIES = [
  { id: 'easy',    label: 'Easy'    },
  { id: 'medium',  label: 'Medium'  },
  { id: 'hard',    label: 'Hard'    },
  { id: 'extreme', label: 'Extreme' },
];

const QUESTION_OPTIONS = {
  easy:    ['10', '20', '30', '50'],
  medium:  ['25', '50', '75', '100'],
  hard:    ['25', '50', '100', '150'],
  extreme: ['50', '100', '150', '200'],
};

const DEFAULT_QUESTIONS = {
  easy:    '10',
  medium:  '25',
  hard:    '25',
  extreme: '50',
};

const TIMERS = [
  { id: '5',  label: '5s'  },
  { id: '10', label: '10s' },
  { id: '15', label: '15s' },
  { id: '0',  label: '∞'   },
];

const TIME_LIMITS = [
  { id: '60',  label: '1 min' },
  { id: '120', label: '2 min' },
  { id: '300', label: '5 min' },
];

export default function GameSelect() {
  const { gameId } = useParams();
  const navigate   = useNavigate();

  const [mode,       setMode]       = useState('classic');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions,  setQuestions]  = useState(DEFAULT_QUESTIONS['medium']);
  const [timer,      setTimer]      = useState('10');
  const [timeLimit,  setTimeLimit]  = useState('120');

  // ✅ Bug 1 fixed — inside component so it can access state setters
  const handleDifficulty = (d) => {
    setDifficulty(d);
    setQuestions(DEFAULT_QUESTIONS[d]);
  };

  const game = games.find(g => g.id === gameId);

  useEffect(() => {
    document.title = game ? `MeridianPlay · ${game.title}` : 'MeridianPlay';
  }, [game]);

  if (!game) return (
    <div style={{ padding: 40, color: 'var(--text-400)' }}>
      Game not found.{' '}
      <span style={{ color: 'var(--accent)', cursor: 'pointer' }}
        onClick={() => navigate('/')}>Go home</span>
    </div>
  );

  const Icon = ICON_MAP[game.icon];


  const handleStart = () => {
    const params = new URLSearchParams({
      mode,
      difficulty,
      ...(mode === 'classic'  && { questions, timer }),
      ...(mode === 'endless'  && { timer }),
      ...(mode === 'speedrun' && { timeLimit }),
    });
    navigate(`${game.playPath}?${params.toString()}`);
  };

  const getStartLabel = () => {
    if (mode === 'classic')  return `Start · ${questions} questions`;
    if (mode === 'endless')  return 'Start Endless Run';
    if (mode === 'speedrun') {
      const t = TIME_LIMITS.find(t => t.id === timeLimit);
      return `Start Speedrun · ${t?.label}`;
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate('/')}><IconArrowLeft size={16} /></button>
        <span className={styles.navTitle}>Game Setup</span>
      </nav>

      <div className={styles.body}>

        {/* Game info */}
        <div className={styles.gameInfo}>
          <div className={styles.gameIcon}>
            {Icon && <Icon size={28} stroke={1.5} />}
          </div>
          <div>
            <h1 className={styles.gameTitle}>{game.title}</h1>
            <p className={styles.gameDesc}>{game.description}</p>
          </div>
        </div>

        {/* Mode picker */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Mode</p>
          <div className={styles.modeGrid}>
            {MODES.map(m => (
              <button
                key={m.id}
                className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
                style={mode === m.id ? { borderColor: m.color } : {}}
                onClick={() => setMode(m.id)}
              >
                <div className={styles.modeIndicator} style={{ background: m.color }} />
                <span
                  className={styles.modeName}
                  style={mode === m.id ? { color: m.color } : {}}
                >
                  {m.name}
                </span>
                <p className={styles.modeDesc}>{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty — all modes */}
        {/* ✅ Bug 2 fixed — iterating DIFFICULTIES not QUESTION_OPTIONS */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Difficulty</p>
          <div className={styles.pillRow}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                className={`${styles.pill} ${difficulty === d.id ? styles.pillActive : ''}`}
                onClick={() => handleDifficulty(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Classic-only options */}
        {mode === 'classic' && (
          <>
            {/* ✅ Bug 3 fixed — using QUESTION_OPTIONS[difficulty] */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Questions</p>
              <div className={styles.pillRow}>
                {QUESTION_OPTIONS[difficulty].map(q => (
                  <button
                    key={q}
                    className={`${styles.pill} ${questions === q ? styles.pillActive : ''}`}
                    onClick={() => setQuestions(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <p className={styles.sectionLabel}>Timer per question</p>
              <div className={styles.pillRow}>
                {TIMERS.map(t => (
                  <button
                    key={t.id}
                    className={`${styles.pill} ${timer === t.id ? styles.pillActive : ''}`}
                    onClick={() => setTimer(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Endless-only options */}
        {mode === 'endless' && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Timer per question</p>
            <div className={styles.pillRow}>
              {TIMERS.map(t => (
                <button
                  key={t.id}
                  className={`${styles.pill} ${timer === t.id ? styles.pillActive : ''}`}
                  onClick={() => setTimer(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Speedrun-only options */}
        {mode === 'speedrun' && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Time limit</p>
            <div className={styles.pillRow}>
              {TIME_LIMITS.map(t => (
                <button
                  key={t.id}
                  className={`${styles.pill} ${timeLimit === t.id ? styles.pillActive : ''}`}
                  onClick={() => setTimeLimit(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start */}
        <div>
          <button className={styles.startBtn} onClick={handleStart}>
            {getStartLabel()} <IconArrowRight size={16} style={{ verticalAlign: 'middle' }} />
          </button>
          <p className={styles.startInfo} style={{ marginTop: 12 }}>
            {mode === 'classic'  && `${questions} questions · ${timer === '0' ? 'No timer' : `${timer}s each`}`}
            {mode === 'endless'  && 'One wrong answer ends the run'}
            {mode === 'speedrun' && 'Answer as many as possible before time runs out'}
          </p>
        </div>

      </div>
    </div>
  );
}