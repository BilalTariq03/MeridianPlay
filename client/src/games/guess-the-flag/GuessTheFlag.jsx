import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import QuizLayout from '../../components/QuizLayout';
import Results from '../../components/Results';

const API_URL = import.meta.env.VITE_API_URL;

function GuessTheFlag() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const location   = useLocation();
  const difficulty = new URLSearchParams(location.search).get('difficulty') || 'medium';

  useEffect(() => {
    axios.get(`${API_URL}/api/questions/flags?difficulty=${difficulty}`)
      .then(res => {
        console.log('API response:', res.data); 
        setQuestions(res.data)}
      )
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error)   return <p style={{ padding: 40, color: 'red' }}>{error}</p>;

  return <GameRunner questions={questions} />;
}

// Separate component so useQuiz only mounts when questions are ready
function GameRunner({ questions }) {
  const quiz = useQuiz(questions);

  if (quiz.status === 'finished') {
    return <Results score={quiz.score} total={quiz.total} />;
  }

  return (
    <QuizLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Guess the Flag"
      renderQuestion={(q) => (
        <img
          src={q.flag}
          alt="Guess this flag"
          style={{ width: '240px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        />
      )}
    />
  );
}

export default GuessTheFlag;