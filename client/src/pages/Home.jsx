import { useNavigate } from 'react-router-dom';
import {
  IconFlag2,
  IconBuildingBank,
  IconMap2,
  IconCoin,
  IconWorld,
} from '@tabler/icons-react';
import games from '../config/games.config';
import styles from './Home.module.css';

// Map game ID → Tabler icon component
const ICON_MAP = {
  'flag':          IconFlag2,
  'building-bank': IconBuildingBank,
  'map-2':         IconMap2,
  'coin':          IconCoin,
};

function Globe() {
  return (
    <div className={styles.globeWrap} aria-hidden="true">
      <svg viewBox="0 0 900 900" className={styles.globeSvg}>
        <defs>
          <clipPath id="globeClip">
            <circle cx="450" cy="450" r="400" />
          </clipPath>
        </defs>

        {/* Static latitude lines */}
        <g clipPath="url(#globeClip)">
          <ellipse cx="450" cy="450" rx="400" ry="20"  fill="none" stroke="rgba(245,158,11,0.22)" strokeWidth="0.8"/>
          <ellipse cx="450" cy="450" rx="400" ry="75"  fill="none" stroke="rgba(245,158,11,0.18)" strokeWidth="0.8"/>
          <ellipse cx="450" cy="450" rx="400" ry="150" fill="none" stroke="rgba(245,158,11,0.14)" strokeWidth="0.8"/>
          <ellipse cx="450" cy="450" rx="400" ry="230" fill="none" stroke="rgba(245,158,11,0.11)" strokeWidth="0.8"/>
          <ellipse cx="450" cy="450" rx="400" ry="320" fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="0.8"/>
        </g>

        {/* Rotating group — longitude lines + all dots */}
        <g clipPath="url(#globeClip)">
          <g className={styles.rotatingGroup}>

            {/* Longitude lines */}
            <ellipse cx="450" cy="450" rx="20"  ry="400" fill="none" stroke="rgba(245,158,11,0.18)" strokeWidth="0.8"/>
            <ellipse cx="450" cy="450" rx="85"  ry="400" fill="none" stroke="rgba(245,158,11,0.14)" strokeWidth="0.8"/>
            <ellipse cx="450" cy="450" rx="160" ry="400" fill="none" stroke="rgba(245,158,11,0.11)" strokeWidth="0.8"/>
            <ellipse cx="450" cy="450" rx="250" ry="400" fill="none" stroke="rgba(245,158,11,0.09)" strokeWidth="0.8"/>
            <ellipse cx="450" cy="450" rx="340" ry="400" fill="none" stroke="rgba(245,158,11,0.07)" strokeWidth="0.8"/>

            {/* Top region */}
            <circle cx="450" cy="185" r="4"   fill="#F59E0B" opacity="0.50"/>
            <circle cx="350" cy="210" r="3.5" fill="#F59E0B" opacity="0.55"/>
            <circle cx="560" cy="220" r="3"   fill="#F59E0B" opacity="0.45"/>
            <circle cx="490" cy="240" r="3.5" fill="#F59E0B" opacity="0.50"/>
            <circle cx="380" cy="260" r="3"   fill="#F59E0B" opacity="0.45"/>

            {/* Upper middle */}
            <circle cx="295" cy="300" r="4"   fill="#F59E0B" opacity="0.65"/>
            <circle cx="615" cy="315" r="3.5" fill="#F59E0B" opacity="0.60"/>
            <circle cx="510" cy="290" r="3"   fill="#F59E0B" opacity="0.55"/>
            <circle cx="420" cy="330" r="4.5" fill="#F59E0B" opacity="0.70"/>
            <circle cx="640" cy="370" r="3"   fill="#F59E0B" opacity="0.55"/>

            {/* Equator band */}
            <circle cx="220" cy="440" r="4"   fill="#F59E0B" opacity="0.75"/>
            <circle cx="680" cy="450" r="4"   fill="#F59E0B" opacity="0.70"/>
            <circle cx="340" cy="460" r="3.5" fill="#F59E0B" opacity="0.80"/>
            <circle cx="570" cy="435" r="3.5" fill="#F59E0B" opacity="0.75"/>
            <circle cx="470" cy="470" r="5"   fill="#F59E0B" opacity="0.85"/>
            <circle cx="260" cy="480" r="3"   fill="#F59E0B" opacity="0.65"/>

            {/* Lower middle */}
            <circle cx="580" cy="520" r="4"   fill="#F59E0B" opacity="0.65"/>
            <circle cx="310" cy="510" r="3.5" fill="#F59E0B" opacity="0.60"/>
            <circle cx="490" cy="545" r="3.5" fill="#F59E0B" opacity="0.55"/>
            <circle cx="400" cy="560" r="3"   fill="#F59E0B" opacity="0.50"/>
            <circle cx="630" cy="490" r="3"   fill="#F59E0B" opacity="0.55"/>

            {/* Bottom region */}
            <circle cx="450" cy="620" r="3.5" fill="#F59E0B" opacity="0.40"/>
            <circle cx="370" cy="650" r="3"   fill="#F59E0B" opacity="0.35"/>
            <circle cx="530" cy="640" r="3"   fill="#F59E0B" opacity="0.38"/>
            <circle cx="450" cy="700" r="2.5" fill="#F59E0B" opacity="0.28"/>

          </g>
        </g>

        {/* Globe outline */}
        <circle cx="450" cy="450" r="400" fill="none" stroke="rgba(245,158,11,0.28)" strokeWidth="1"/>
        {/* Outer glow ring */}
        <circle cx="450" cy="450" r="418" fill="none" stroke="rgba(245,158,11,0.06)" strokeWidth="18"/>
      </svg>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>

      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.navIcon}>
            <IconWorld size={18} color="#000" />
          </div>
          <span className={styles.navName}>TRIVIA</span>
        </div>
        <span className={styles.navTagline}>Geography · Gamified</span>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Geo Trivia · 4 Games
          </p>
          <h1 className={styles.heroTitle}>
            Explore the world <br/>
            <span className={styles.heroTitleAccent}>one
            round</span> at a time.
          </h1>
          <p className={styles.heroSub}>
            Test your knowledge across flags, capitals,
            maps and currencies. Four games, ten questions each.
          </p>
          <div className={styles.heroCta}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/games/guess-the-flag')}
            >
              Play now →
            </button>
            <span className={styles.heroMeta}>No account needed</span>
          </div>
        </div>

        <div className={styles.heroRight}>
          <Globe />
        </div>
      </section>

      {/* Games */}
      <section className={styles.gamesSection}>
        <div className={styles.categoryRow}>
          <span className="section-label">Geography</span>
          <div className={styles.categoryLine} />
        </div>

        <div className={styles.cards}>
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => game.available && navigate(game.path)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

function GameCard({ game, onClick }) {
  const Icon = ICON_MAP[game.icon];

  return (
    <div
      onClick={onClick}
      className={`card ${styles.card} ${!game.available ? styles.cardDisabled : ''}`}
    >
      <div className={styles.cardTop}>
        <div className={styles.cardIconWrap}>
          {Icon && <Icon size={24} stroke={1.5} />}
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{game.title}</h3>
        <p className={styles.cardDesc}>{game.description}</p>
        <div className={styles.cardFooter}>
          <span className={`badge ${game.available ? 'badge-accent' : 'badge-muted'}`}>
            {game.available ? game.category : 'Coming soon'}
          </span>
          {game.available && <span className={styles.cardPlay}>Play →</span>}
        </div>
      </div>
    </div>
  );
}