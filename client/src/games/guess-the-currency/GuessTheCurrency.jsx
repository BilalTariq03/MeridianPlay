import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import QuizLayout from '../../components/QuizLayout';
import Results from '../../components/Results';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GuessTheCurrency() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const location   = useLocation();
  const difficulty = new URLSearchParams(location.search).get('difficulty') || 'medium';

  useEffect(() => {
    axios.get(`${API_URL}/api/questions/currencies?difficulty=${difficulty}`)
      .then(res => setQuestions(res.data))
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error)   return <p style={{ padding: 40, color: 'red' }}>{error}</p>;

  return <GameRunner questions={questions} />;
}

function GameRunner({ questions }) {
  const quiz = useQuiz(questions);

  if (quiz.status === 'finished') {
    return <Results score={quiz.score} total={quiz.total} />;
  }

  return (
    <QuizLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Guess the Currency"
      renderQuestion={(q) => (
        <div style={{ textAlign: 'center' }}>
          <img
            src={q.flag}
            alt={q.question}
            style={{ width: '120px', borderRadius: '6px', marginBottom: '16px' }}
          />
          <p style={{ color: '#94a3b8', marginBottom: '6px', fontSize: '0.9rem' }}>
            What currency does this country use?
          </p>
          <h2 style={{ fontSize: '1.8rem' }}>{q.question}</h2>
        </div>
      )}
    />
  );
}

export default GuessTheCurrency;