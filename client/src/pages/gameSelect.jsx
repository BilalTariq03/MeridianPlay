import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconFlag2, IconBuildingBank,
  IconMap2, IconCoin,
} from '@tabler/icons-react';
import games from '../config/games.config';
import styles from './GameSelect.module.css';

const ICON_MAP = {
  'flag':          IconFlag2,
  'building-bank': IconBuildingBank,
  'map-2':         IconMap2,
  'coin':          IconCoin,
};

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Easy',
    desc: '~50 major countries everyone knows',
    color: '#22C55E',
  },
  {
    id: 'medium',
    label: 'Medium',
    desc: '~100 countries including less-known ones',
    color: '#F59E0B',
  },
  {
    id: 'hard',
    label: 'Hard',
    desc: '~150 fully independent nations',
    color: '#F97316',
  },
  {
    id: 'extreme',
    label: 'Extreme',
    desc: '~195 everything including territories',
    color: '#EF4444',
  },
];

export default function GameSelect() {
  const { gameId }              = useParams();
  const navigate                = useNavigate();
  const [difficulty, setDiff]   = useState('medium');

  const game = games.find(g => g.id === gameId);

  if (!game) {
    return (
      <div style={{ padding: 40, color: 'var(--text-400)' }}>
        Game not found. <span
          style={{ color: 'var(--accent)', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >Go home</span>
      </div>
    );
  }

  const Icon = ICON_MAP[game.icon];

  const handleStart = () => {
    navigate(`${game.playPath}?difficulty=${difficulty}`);
  };

  return (
    <div className={styles.page}>

      {/* Navbar */}
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>
        <span className={styles.navTitle}>Select Difficulty</span>
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

        {/* Difficulty picker */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Difficulty</p>
          <div className={styles.diffGrid}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                className={`${styles.diffBtn} ${difficulty === d.id ? styles.diffActive : ''}`}
                style={difficulty === d.id ? { borderColor: d.color } : {}}
                onClick={() => setDiff(d.id)}
              >
                <div className={styles.diffTop}>
                  <span
                    className={styles.diffLabel}
                    style={difficulty === d.id ? { color: d.color } : {}}
                  >
                    {d.label}
                  </span>
                  {difficulty === d.id && (
                    <span className={styles.diffCheck} style={{ color: d.color }}>✓</span>
                  )}
                </div>
                <p className={styles.diffDesc}>{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <button className={styles.startBtn} onClick={handleStart}>
          Start Round →
        </button>

        {/* Info */}
        <p className={styles.info}>10 questions · 10 seconds each</p>

      </div>
    </div>
  );
}