import { useReducer, useEffect, useRef, useState } from 'react';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ANSWER':
      return {
        ...state,
        selected: action.choice,
        score:    action.isCorrect ? state.score + 1 : state.score,
        correct:  action.isCorrect ? state.correct + 1 : state.correct,
        total:    state.total + 1,
        status:   'feedback',
      };
    case 'NEXT': {
      const next = state.index + 1;
      if (next >= state.questions.length) {
        // Exhausted the pool — re-shuffle and cycle from the start
        return {
          ...state,
          index:     0,
          questions: shuffle(state.questions),
          selected:  null,
          status:    'playing',
        };
      }
      return { ...state, index: next, selected: null, status: 'playing' };
    }
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'FINISH':
      return { ...state, status: 'finished' };
    case 'LOAD_QUESTIONS':
      return { ...state, questions: shuffle(action.questions) };
    default:
      return state;
  }
}

export function useSpeedrun(fetchMore, timeLimit = 120) {
  const fetchMoreRef = useRef(fetchMore);

  const init = {
    index:     0,
    score:     0,
    correct:   0,
    total:     0,
    selected:  null,
    timeLeft:  timeLimit,
    status:    'playing',
    questions: [],
  };

  const [state, dispatch]     = useReducer(reducer, init);
  const [loading, setLoading] = useState(true);

  const { index, score, correct, total,
          selected, timeLeft, status, questions } = state;

  // Fetch all available questions once on mount, then shuffle and use them in order
  useEffect(() => {
    fetchMoreRef.current().then(qs => {
      dispatch({ type: 'LOAD_QUESTIONS', questions: qs });
      setLoading(false);
    });
  }, []);

  // Global countdown — ticks every second
  useEffect(() => {
    if (status !== 'playing' && status !== 'feedback') return;
    if (timeLeft === 0) { dispatch({ type: 'FINISH' }); return; }
    const t = setTimeout(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status]);

  // Short feedback pause (500ms) before advancing
  useEffect(() => {
    if (status !== 'feedback') return;
    const t = setTimeout(() => dispatch({ type: 'NEXT' }), 500);
    return () => clearTimeout(t);
  }, [status]);

  const handleAnswer = (choice) => {
    if (status !== 'playing') return;
    const isCorrect = choice === questions[index]?.answer;
    dispatch({ type: 'ANSWER', choice, isCorrect });
  };

  return {
    question: questions[index],
    index,
    score,
    correct,
    total,
    selected,
    timeLeft,
    timeLimit,
    status,
    loading,
    handleAnswer,
  };
}
