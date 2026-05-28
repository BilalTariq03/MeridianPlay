import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import QuizLayout from '../../components/QuizLayout';
import Results from '../../components/Results';
import { useGameParams } from '../../hooks/useGameParams';
import { useEndless } from '../../hooks/useEndless';
import EndlessLayout from '../../components/EndlessLayout';
import EndlessResults from '../../components/EndlessResults';
import { useSpeedrun } from '../../hooks/useSpeedrun';
import SpeedrunLayout from '../../components/SpeedrunLayout';
import SpeedrunResults from '../../components/SpeedrunResults';
import LoadingScreen from '../../components/LoadingScreen';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FLAG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 100'%3E%3Crect width='160' height='100' fill='%231E283C' rx='6'/%3E%3Ctext x='80' y='50' font-family='monospace' font-size='10' fill='%2364748B' text-anchor='middle' dominant-baseline='middle'%3EUnavailable%3C/text%3E%3C/svg%3E";
const onFlagError = e => { e.currentTarget.onerror = null; e.currentTarget.src = FLAG_FALLBACK; };

function GuessTheCurrency() {
  const [questions,  setQuestions]  = useState([]);
  const [error,      setError]      = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryKey,   setRetryKey]   = useState(0);
  const [warming,    setWarming]    = useState(false);

  const { difficulty, questions: questionCount, timer, mode, timeLimit } = useGameParams();
  const [loading, setLoading] = useState(mode !== 'endless');

  useEffect(() => {
    if (mode === 'endless') return;

    let retryTimer;
    axios.get(`${API_URL}/api/questions/currencies`, {
      params: { difficulty, questions: questionCount },
    })
      .then(res => { setQuestions(res.data); setLoading(false); setWarming(false); })
      .catch(err => {
        const isNetwork = err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED';
        if (isNetwork && retryCount < 3) {
          setWarming(true);
          retryTimer = setTimeout(() => setRetryCount(c => c + 1), 5000);
        } else {
          setError('Failed to load questions.');
          setLoading(false);
          setWarming(false);
        }
      });

    return () => clearTimeout(retryTimer);
  }, [difficulty, questionCount, mode, retryCount, retryKey]);

  const handleRetry = () => { setLoading(true); setRetryCount(0); setError(null); setWarming(false); setRetryKey(k => k + 1); };

  if (loading) return <LoadingScreen
    message={warming ? 'Server is warming up, please wait...' : undefined}
    subtext={warming ? `Attempt ${retryCount + 1} / 3` : undefined}
  />;
  if (error) return <LoadingScreen message="Failed to connect to server." onRetry={handleRetry} />;

  if (mode === 'endless') {
    return <EndlessRunner difficulty={difficulty} questionTime={parseInt(timer)} />;
  }

  if (mode === 'speedrun') {
  return <SpeedrunRunner difficulty={difficulty} timeLimit={parseInt(timeLimit)} />;
}

  return <GameRunner questions={questions} questionTime={timer} />;
}

function GameRunner({ questions, questionTime }) {
  const quiz = useQuiz(questions, questionTime);

  if (quiz.status === 'finished') {
    return(
    <Results
      score={quiz.score}
      total={quiz.total}
      history={quiz.history}
      questions={questions}
      gameTitle="Guess the Currency"
    />)
  }

  return (
    <QuizLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Guess the Currency"
      questionTime={questionTime}
      renderQuestion={(q) => (
        <div style={{ textAlign: 'center' }}>
          <img
            src={q.flag}
            alt={q.question}
            onError={onFlagError}
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

function EndlessRunner({ difficulty, questionTime }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/currencies`, {
      params: { difficulty, questions: 250 }
    }).then(r => r.data);

  const endless = useEndless(fetchMore, questionTime);

  if (endless.status === 'dead' ||endless.status === 'completed') {
    return <EndlessResults score={endless.score} streak={endless.streak} best={endless.best} completed={endless.status === 'completed'} />;
  }

  if (endless.loading || !endless.question) {
    return <LoadingScreen />;
  }

  return (
    <EndlessLayout
      {...endless}
      onAnswer={endless.handleAnswer}
      gameTitle="Guess the Currency"
      renderQuestion={(q) => (
        <div style={{ textAlign: 'center' }}>
          <img
            src={q.flag}
            alt={q.question}
            onError={onFlagError}
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


function SpeedrunRunner({ difficulty, timeLimit }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/currencies`, {
      params: { difficulty, questions: 250 }
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
    return <LoadingScreen />;
  }

  return (
    <SpeedrunLayout
      {...speedrun}
      onAnswer={speedrun.handleAnswer}
      gameTitle="Guess the Currency"
      renderQuestion={(q) => (
        <div style={{ textAlign: 'center' }}>
          <img
            src={q.flag}
            alt={q.question}
            onError={onFlagError}
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