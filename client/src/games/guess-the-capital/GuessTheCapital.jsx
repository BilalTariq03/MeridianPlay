import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import QuizLayout from '../../components/QuizLayout';
import Results from '../../components/Results';
import { useGameParams } from '../../hooks/useGameParams';
import EndlessLayout from '../../components/EndlessLayout';
import EndlessResults from '../../components/EndlessResults';
import { useEndless } from '../../hooks/useEndless';
import { useSpeedrun } from '../../hooks/useSpeedrun';
import SpeedrunLayout from '../../components/SpeedrunLayout';
import SpeedrunResults from '../../components/SpeedrunResults';



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GuessTheCapital() {
  const [questions, setQuestions] = useState([]);
  const [error, setError]         = useState(null);

  const { difficulty, questions: questionCount, timer, mode, timeLimit } = useGameParams();

  const [loading, setLoading] = useState(mode !== 'endless');

  useEffect(() => {
    if (mode === 'endless') return;

    axios.get(`${API_URL}/api/questions/capitals`, {
      params: {difficulty, questions: questionCount}
    })
      .then(res => setQuestions(res.data))
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false));
  }, [difficulty, questionCount, mode]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error)   return <p style={{ padding: 40, color: 'red' }}>{error}</p>;

  if (mode === 'endless') {
    return <EndlessRunner difficulty={difficulty} questionTime={parseInt(timer)} />;
  }

  if (mode === 'speedrun') {
  return <SpeedrunRunner difficulty={difficulty} timeLimit={parseInt(timeLimit)} />;
}

  return <GameRunner questions={questions} questionTime={parseInt(timer)} />;
}

function GameRunner({ questions, questionTime }) {
  const quiz = useQuiz(questions, questionTime);

  if (quiz.status === 'finished') {
    return <Results score={quiz.score} total={quiz.total} />;
  }

  return (
    <QuizLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Guess the Capital"
      questionTime={questionTime}
      renderQuestion={(q) => (
        <div>
          <p style={{ color: '#94a3b8', marginBottom: '8px' }}>What is the capital of</p>
          <h2 style={{ fontSize: '2rem' }}>{q.question}</h2>
        </div>
      )}
    />
  );
}


function EndlessRunner({ difficulty, questionTime }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/capitals`, {  // ✅
      params: { difficulty, questions: 10 }
    }).then(r => r.data);

  const endless = useEndless(fetchMore, questionTime);

  if (endless.status === 'dead' || endless.status === 'completed') {
    return <EndlessResults score={endless.score} streak={endless.streak} best={endless.best} completed={endless.status === 'completed'} />;
  }

  if (endless.loading || !endless.question) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  return (
    <EndlessLayout
      {...endless}
      onAnswer={endless.handleAnswer}
      gameTitle="Guess the Capital"                   // ✅
      questionTime={questionTime}
      renderQuestion={(q) => (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-400)', marginBottom: '8px', fontSize: '13px' }}>
            What is the capital of
          </p>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-100)' }}>
            {q.question}                              // ✅ show country name
          </h2>
        </div>
      )}
    />
  );
}

function SpeedrunRunner({ difficulty, timeLimit }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/capitals`, {  // ✅
      params: { difficulty, questions: 10 }
    }).then(r => r.data);

  const speedrun = useSpeedrun(fetchMore, timeLimit);

  if (speedrun.status === 'finished') {
    return (
      <SpeedrunResults
        score={speedrun.score}
        correct={speedrun.correct}
        total={speedrun.total}
        timeLimit={timeLimit}
      />
    );
  }

  if (speedrun.loading || !speedrun.question) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  return (
    <SpeedrunLayout
      {...speedrun}
      onAnswer={speedrun.handleAnswer}
      gameTitle="Guess the Capital"                   // ✅
      renderQuestion={(q) => (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-400)', marginBottom: '8px', fontSize: '13px' }}>
            What is the capital of
          </p>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-100)' }}>
            {q.question}                              // ✅
          </h2>
        </div>
      )}
    />
  );
}

export default GuessTheCapital;