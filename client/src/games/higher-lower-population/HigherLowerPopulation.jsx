import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHigherLower } from '../../hooks/useHigherLower';
import HigherLowerLayout from '../../components/HigherLowerLayout';
import Results from '../../components/Results';
import { useGameParams } from '../../hooks/useGameParams';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function HigherLowerPopulation() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const { difficulty, questions: questionCount, timer } = useGameParams();

  useEffect(() => {
    axios.get(`${API_URL}/api/questions/higher-lower-population`, {
      params: { difficulty, questions: questionCount }
    })
      .then(res => setQuestions(res.data))
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false));
  }, [difficulty, questionCount]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error)   return <p style={{ padding: 40, color: 'red' }}>{error}</p>;

  return <GameRunner questions={questions} questionTime={parseInt(timer)} />;
}

function GameRunner({ questions, questionTime }) {
  const quiz = useHigherLower(questions, questionTime);

  if (quiz.status === 'finished') {
    return (
      <Results
        score={quiz.score}
        total={quiz.total}
        history={quiz.history}
        gameTitle="Higher or Lower: Population"
      />
    );
  }

  return (
    <HigherLowerLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Higher or Lower: Population"
      questionTime={questionTime}
    />
  );
}

export default HigherLowerPopulation;