import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import { useEndless } from '../../hooks/useEndless';
import { useSpeedrun } from '../../hooks/useSpeedrun';
import QuizLayout from '../../components/QuizLayout';
import EndlessLayout from '../../components/EndlessLayout';
import SpeedrunLayout from '../../components/SpeedrunLayout';
import Results from '../../components/Results';
import EndlessResults from '../../components/EndlessResults';
import SpeedrunResults from '../../components/SpeedrunResults';
import { useGameParams } from '../../hooks/useGameParams';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const renderQ = (q) => (
  <div style={{ textAlign: 'center' }}>
    <img
      src={q.flag}
      alt={q.question}
      style={{ width: '120px', borderRadius: '6px', marginBottom: '12px' }}
    />
    <p style={{ color: 'var(--text-400)', fontSize: '13px', marginBottom: '6px' }}>
      Which continent is this country in?
    </p>
    <h2 style={{ fontSize: '1.8rem', color: 'var(--text-100)' }}>
      {q.question}
    </h2>
  </div>
);

function GuessTheContinent() {
  const [questions, setQuestions] = useState([]);
  const [error, setError]         = useState(null);
  const { difficulty, questions: questionCount, timer, mode, timeLimit } = useGameParams();
  const [loading, setLoading]     = useState(mode !== 'endless');

  useEffect(() => {
    if (mode === 'endless') return;
    axios.get(`${API_URL}/api/questions/continents`, {
      params: { difficulty, questions: questionCount }
    })
      .then(res => setQuestions(res.data))
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false));
  }, [difficulty, questionCount, mode]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error)   return <p style={{ padding: 40, color: 'red' }}>{error}</p>;

  if (mode === 'endless')  return <EndlessRunner  difficulty={difficulty} questionTime={parseInt(timer)} />;
  if (mode === 'speedrun') return <SpeedrunRunner difficulty={difficulty} timeLimit={parseInt(timeLimit)} />;
  return <ClassicRunner questions={questions} questionTime={parseInt(timer)} />;
}

function ClassicRunner({ questions, questionTime }) {
  const quiz = useQuiz(questions, questionTime);
  if (quiz.status === 'finished') {
    return <Results score={quiz.score} total={quiz.total} history={quiz.history} gameTitle="Guess the Continent" />;
  }
  return (
    <QuizLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Guess the Continent"
      questionTime={questionTime}
      renderQuestion={renderQ}
    />
  );
}

function EndlessRunner({ difficulty, questionTime }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/continents`, {
      params: { difficulty, questions: 10 }
    }).then(r => r.data);
  const endless = useEndless(fetchMore, questionTime);

  if (endless.status === 'dead' || endless.status === 'completed') {
    return <EndlessResults score={endless.score} streak={endless.streak} best={endless.best} completed={endless.status === 'completed'} />;
  }
  if (endless.loading || !endless.question) return <p style={{ padding: 40 }}>Loading...</p>;
  return (
    <EndlessLayout
      {...endless}
      onAnswer={endless.handleAnswer}
      gameTitle="Guess the Continent"
      questionTime={questionTime}
      renderQuestion={renderQ}
    />
  );
}

function SpeedrunRunner({ difficulty, timeLimit }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/continents`, {
      params: { difficulty, questions: 10 }
    }).then(r => r.data);
  const speedrun = useSpeedrun(fetchMore, timeLimit);

  if (speedrun.status === 'finished') {
    return <SpeedrunResults score={speedrun.score} correct={speedrun.correct} total={speedrun.total} timeLimit={timeLimit} />;
  }
  if (speedrun.loading || !speedrun.question) return <p style={{ padding: 40 }}>Loading...</p>;
  return (
    <SpeedrunLayout
      {...speedrun}
      onAnswer={speedrun.handleAnswer}
      gameTitle="Guess the Continent"
      renderQuestion={renderQ}
    />
  );
}

export default GuessTheContinent;