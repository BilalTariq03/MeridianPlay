function QuizLayout({ question, index, total, score, timeLeft, selected, status, onAnswer, renderQuestion }) {
  if (!question || !question.options) return <p style={{ padding: 40 }}>Loading...</p>;

  const correct = question.answer;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <span style={{ color: '#94a3b8' }}>Question {index + 1} / {total}</span>
        <span style={{ color: '#94a3b8' }}>Score: {score}</span>
        <span style={{ color: timeLeft <= 3 ? '#ef4444' : '#94a3b8' }}>⏱ {timeLeft}s</span>
      </div>

      {/* Game-specific visual (flag image, country name, etc) */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        {renderQuestion(question)}
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {question.options.map(option => {
          let bg = '#1e293b';
          if (status === 'feedback') {
            if (option === correct) bg = '#166534';       // green = correct
            else if (option === selected) bg = '#7f1d1d'; // red = wrong pick
          }

          return (
            <button
              key={option}
              onClick={() => onAnswer(option)}
              disabled={status === 'feedback'}
              style={{
                background: bg,
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '0.95rem',
                cursor: status === 'feedback' ? 'default' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default QuizLayout;