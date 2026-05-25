import games from '../config/games.config';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>🌍 Trivia Platform</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Pick a game and start playing</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {games.map(game => (
          <div
            key={game.id}
            onClick={() => game.available && navigate(game.path)}
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              padding: '24px',
              cursor: game.available ? 'pointer' : 'not-allowed',
              opacity: game.available ? 1 : 0.5,
              border: '1px solid #334155',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{game.emoji}</div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{game.title}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>{game.description}</p>
            {!game.available && (
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Coming Soon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;