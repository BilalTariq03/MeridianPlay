import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuiz } from '../../hooks/useQuiz';
import { useEndless } from '../../hooks/useEndless';
import QuizLayout from '../../components/QuizLayout';
import Results from '../../components/Results';
import { useGameParams } from '../../hooks/useGameParams';
import EndlessLayout from '../../components/EndlessLayout';
import EndlessResults from '../../components/EndlessResults';
import { useSpeedrun } from '../../hooks/useSpeedrun';
import SpeedrunLayout from '../../components/SpeedrunLayout';
import SpeedrunResults from '../../components/SpeedrunResults';
import LoadingScreen from '../../components/LoadingScreen';

const API_URL = import.meta.env.VITE_API_URL;

function GuessTheFlag() {
  const [questions, setQuestions] = useState([]);
  const [error, setError]         = useState(null);

  const { difficulty, questions: questionCount, timer, mode, timeLimit } = useGameParams();

  const [loading, setLoading] = useState(mode !== 'endless');

  useEffect(() => {
    if (mode === 'endless') return;

    axios.get(`${API_URL}/api/questions/flags`,
      {params: {difficulty, questions: questionCount}
    })
      .then(res => setQuestions(res.data))
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false));
  }, [difficulty, questionCount, mode]);

  if (loading) return <LoadingScreen />;
  if (error)   return <p style={{ padding: 40, color: 'red' }}>{error}</p>;

  if (mode === 'endless') {
    return <EndlessRunner difficulty={difficulty} questionTime={parseInt(timer)} />;
  }

  if (mode === 'speedrun') {
    return <SpeedrunRunner difficulty={difficulty} timeLimit={parseInt(timeLimit)} />;
  }

  return <GameRunner questions={questions} questionTime={parseInt(timer)}/>;
}


// Separate component so useQuiz only mounts when questions are ready
function GameRunner({ questions, questionTime }) {
  const quiz = useQuiz(questions, questionTime);
  
  if (quiz.status === 'finished') {
    return(
    <Results
      score={quiz.score}
      total={quiz.total}
      history={quiz.history}
      questions={questions}
      gameTitle="Guess the Flag"
    />)
  }

  return (
    <QuizLayout
      {...quiz}
      onAnswer={quiz.handleAnswer}
      gameTitle="Guess the Flag"
      questionTime={questionTime}
      renderQuestion={(q) => (
        <img
          src={q.flag}
          alt="Guess this flag"
          style={{ width: '380px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        />
      )}
    />
  );
}


function EndlessRunner({ difficulty, questionTime }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/flags`, {
      params: { difficulty, questions: 10 }
    }).then(r => r.data);

  const endless = useEndless(fetchMore, questionTime);

  if (endless.status === 'dead' || endless.status === 'completed') {
    return <EndlessResults score={endless.score} streak={endless.streak} best={endless.best} completed={endless.status === 'completed'}/>;
  }

  if (endless.loading || !endless.question) {
    return <LoadingScreen />;
  }

  return (
    <EndlessLayout
      {...endless}
      onAnswer={endless.handleAnswer}
      gameTitle="Guess the Flag"
      questionTime={questionTime}
      renderQuestion={(q) => (
        <img src={q.flag} alt="flag"
          style={{ width: '280px', borderRadius: '8px' }} />
      )}
    />
  );
}


function SpeedrunRunner({ difficulty, timeLimit }) {
  const fetchMore = () =>
    axios.get(`${API_URL}/api/questions/flags`, {
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
    return <LoadingScreen />;
  }

  return (
    <SpeedrunLayout
      {...speedrun}
      onAnswer={speedrun.handleAnswer}
      gameTitle="Guess the Flag"
      renderQuestion={(q) => (
        <img
          src={q.flag}
          alt="flag"
          style={{ width: '280px', borderRadius: '8px' }}
        />
      )}
    />
  );
}

export default GuessTheFlag;