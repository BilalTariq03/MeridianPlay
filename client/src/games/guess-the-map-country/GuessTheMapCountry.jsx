import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import QuizLayout from '../../components/QuizLayout';
import Results from '../../components/Results';
import WorldMap from '../../components/WorldMap';
import { useGameParams } from '../../hooks/useGameParams';
import { useEndless } from '../../hooks/useEndless';
import EndlessLayout from '../../components/EndlessLayout';
import EndlessResults from '../../components/EndlessResults';
import { useSpeedrun } from '../../hooks/useSpeedrun';
import SpeedrunLayout from '../../components/SpeedrunLayout';
import SpeedrunResults from '../../components/SpeedrunResults';
import LoadingScreen from '../../components/LoadingScreen';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GuessTheMapCountry() {
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
    axios.get(`${API_URL}/api/questions/map-location`, {
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
      gameTitle="Guess the Country"
    />
  )}

  return (
    <QuizLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Guess the Country"
      questionTime={questionTime}
      layout="split"
      renderQuestion={(q) => (
        <WorldMap
          numericCode={q.numericCode}
          latlng={q.latlng}
          area={q.area}
        />
      )}
    />
  );
}


function EndlessRunner({ difficulty, questionTime }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/map-location`, {
      params: { difficulty, questions: 250 }
    }).then(r => r.data);

  const endless = useEndless(fetchMore, questionTime);

  if (endless.status === 'dead' || endless.status === 'completed') {
    return <EndlessResults score={endless.score} streak={endless.streak} best={endless.best} completed={endless.status === 'completed'} />;
  }

  if (endless.loading || !endless.question) {
    return <LoadingScreen />;
  }

  return (
    <EndlessLayout
      {...endless}
      onAnswer={endless.handleAnswer}
      gameTitle="Guess the Country"
      layout="split"
      renderQuestion={(q) => (
        <WorldMap
          numericCode={q.numericCode}
          latlng={q.latlng}
          area={q.area}
        />
      )}
    />
  );
}


function SpeedrunRunner({ difficulty, timeLimit }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/map-location`, {
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
      gameTitle="Guess the Country"
      layout="split"
      renderQuestion={(q) => (
        <WorldMap
          numericCode={q.numericCode}
          latlng={q.latlng}
          area={q.area}
        />
      )}
    />
  );
}

export default GuessTheMapCountry;