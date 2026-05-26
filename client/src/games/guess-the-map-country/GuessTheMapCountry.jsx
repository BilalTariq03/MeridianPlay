import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import QuizLayout from '../../components/QuizLayout';
import Results from '../../components/Results';
import WorldMap from '../../components/WorldMap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GuessTheMapCountry() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/questions/map-location`)
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
      renderQuestion={(q) => (
      <div>
        <p style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '0.9rem' }}>
          Which country is highlighted?
        </p>
        <WorldMap
          numericCode={q.numericCode}
          latlng={q.latlng}
          area={q.area}
        />
      </div>
    )}
    />
  );
}

export default GuessTheMapCountry;