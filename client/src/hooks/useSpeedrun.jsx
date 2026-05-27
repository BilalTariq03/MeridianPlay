import { useReducer, useEffect, useRef, useState } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'ANSWER':
      return {
        ...state,
        selected:  action.choice,
        score:     action.isCorrect ? state.score + 1 : state.score,
        correct:   action.isCorrect ? state.correct + 1 : state.correct,
        total:     state.total + 1,
        status:    'feedback',
      };
    case 'NEXT':
      return {
        ...state,
        index:    state.index + 1,
        selected: null,
        status:   'playing',
      };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'FINISH':
      return { ...state, status: 'finished' };
    case 'ADD_QUESTIONS':
      return { ...state, questions: [...state.questions, ...action.questions] };
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

  // Initial fetch
  useEffect(() => {
    fetchMoreRef.current().then(qs => {
      dispatch({ type: 'ADD_QUESTIONS', questions: qs });
      setLoading(false);
    });
  }, []);

  // Fetch more when running low
  useEffect(() => {
    if (questions.length - index < 5 && status === 'playing') {
      fetchMoreRef.current().then(qs => {
        dispatch({ type: 'ADD_QUESTIONS', questions: qs });
      });
    }
  }, [index, questions.length, status]);

  // Global countdown — ticks every second
  useEffect(() => {
    if (status !== 'playing' && status !== 'feedback') return;
    if (timeLeft === 0) {
      dispatch({ type: 'FINISH' });
      return;
    }
    const t = setTimeout(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status]);

  // Feedback pause — very short (500ms) to keep pace fast
  useEffect(() => {
    if (status !== 'feedback') return;
    const t = setTimeout(() => {
      dispatch({ type: 'NEXT' });
    }, 500);
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