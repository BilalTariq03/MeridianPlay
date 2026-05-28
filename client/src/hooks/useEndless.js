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
      if (!action.isCorrect) {
        return { ...state, selected: action.choice, status: 'dead' };
      }
      return {
        ...state,
        selected:   action.choice,
        score:      state.score + (1 * state.multiplier),
        streak:     state.streak + 1,
        best:       Math.max(state.best, state.streak + 1),
        multiplier: state.streak + 1 >= 5 ? 3
                  : state.streak + 1 >= 3 ? 2
                  : 1,
        status:     'feedback',
      };
    case 'NEXT':
      return {
        ...state,
        index:    state.index + 1,
        selected: null,
        timeLeft: action.questionTime,
        status:   'playing',
      };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'LOAD_QUESTIONS':
      return { ...state, questions: shuffle(action.questions) };
    case 'COMPLETE':
      return { ...state, status: 'completed' };
    default:
      return state;
  }
}

export function useEndless(fetchMore, questionTime = 10) {
  const fetchMoreRef = useRef(fetchMore);

  const init = {
    index:      0,
    score:      0,
    streak:     0,
    best:       0,
    multiplier: 1,
    selected:   null,
    timeLeft:   questionTime,
    status:     'playing',
    questions:  [],
  };

  const [state, dispatch]     = useReducer(reducer, init);
  const [loading, setLoading] = useState(true);

  const { index, score, streak, best, multiplier,
          selected, timeLeft, status, questions } = state;

  // Fetch all available questions once on mount, shuffle them
  useEffect(() => {
    fetchMoreRef.current().then(qs => {
      dispatch({ type: 'LOAD_QUESTIONS', questions: qs });
      setLoading(false);
    });
  }, []);

  // Per-question countdown timer
  useEffect(() => {
    if (status !== 'playing' || loading) return;
    if (questionTime === 0) return;

    const isTimeUp = timeLeft === 0;
    const t = setTimeout(() => {
      dispatch(
        isTimeUp
          ? { type: 'ANSWER', choice: null, isCorrect: false }
          : { type: 'TICK' }
      );
    }, isTimeUp ? 0 : 1000);

    return () => clearTimeout(t);
  }, [timeLeft, status, loading, questionTime]);

  // Feedback pause → advance or complete when all questions answered
  useEffect(() => {
    if (status !== 'feedback') return;
    const t = setTimeout(() => {
      if (index + 1 >= questions.length) {
        dispatch({ type: 'COMPLETE' });
      } else {
        dispatch({ type: 'NEXT', questionTime });
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [status, index, questions.length, questionTime]);

  const handleAnswer = (choice) => {
    if (status !== 'playing') return;
    const isCorrect = choice === questions[index]?.answer;
    dispatch({ type: 'ANSWER', choice, isCorrect });
  };

  return {
    question:   questions[index],
    index,
    score,
    streak,
    best,
    multiplier,
    selected,
    timeLeft,
    status,
    loading,
    handleAnswer,
  };
}
