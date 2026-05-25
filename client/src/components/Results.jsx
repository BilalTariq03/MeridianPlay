import { useNavigate } from 'react-router-dom';

function Results({ score, total }) {
  const navigate = useNavigate();
  const percent  = Math.round((score / total) * 100);

  const message =
    percent === 100 ? '🏆 Perfect score!' :
    percent >= 70   ? '🎉 Great job!'     :
    percent >= 40   ? '👍 Not bad!'       :
                      '📚 Keep practicing!';

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{message}</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '32px' }}>
        You got <strong style={{ color: '#f1f5f9' }}>{score} / {total}</strong> correct
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => window.location.reload()}
          style={btnStyle('#1e293b')}
        >
          🔁 Play Again
        </button>
        <button
          onClick={() => navigate('/')}
          style={btnStyle('#0f172a')}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg,
  color: '#f1f5f9',
  border: '1px solid #334155',
  borderRadius: '10px',
  padding: '12px 24px',
  fontSize: '1rem',
  cursor: 'pointer',
});

export default Results;