import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconFlag2,
  IconBuildingBank,
  IconMap2,
  IconCoin,
  IconWorld,
  IconLanguage,
  IconArrowsUpDown 
} from '@tabler/icons-react';

import GlobeGL from 'react-globe.gl';
import { IconArrowRight } from '@tabler/icons-react';
import games from '../config/games.config';
import styles from './Home.module.css';

const ICON_MAP = {
  'flag':          IconFlag2,
  'building-bank': IconBuildingBank,
  'map-2':         IconMap2,
  'coin':          IconCoin,
  'language':      IconLanguage,
  'world':         IconWorld, 
  'arrows-up-down': IconArrowsUpDown,
};

function Globe() {
  const globeRef = useRef();

  useEffect(() => {
    if (!globeRef.current) return;
    const ctrl = globeRef.current.controls();
    ctrl.autoRotate      = true;
    ctrl.autoRotateSpeed = 0.4;
    ctrl.enableZoom      = false;
    ctrl.enablePan       = false;
    ctrl.enableRotate    = false;
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 1.8 });
  }, []);

  return (
    <div className={styles.globeWrap} aria-hidden="true">
      <GlobeGL
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl={null}
        backgroundColor="rgba(0,0,0,0)"
        width={850}
        height={850}
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => { document.title = 'MeridianPlay · Geography Trivia'; }, []);

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
              Play now <IconArrowRight size={15} style={{ verticalAlign: 'middle' }} />
            </button>
            <span className={styles.heroMeta}>No account needed</span>
          </div>
        </div>

        <div className={styles.heroRight}>
          <Globe />
        </div>
      </section>

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
          {game.available && <span className={styles.cardPlay}>Play <IconArrowRight size={13} style={{ verticalAlign: 'middle' }} /></span>}
        </div>
      </div>
    </div>
  );
}
