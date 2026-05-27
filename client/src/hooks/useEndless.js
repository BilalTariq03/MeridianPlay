import { useReducer, useEffect, useRef, useState } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'ANSWER':
      if (!action.isCorrect) {
        return { ...state, selected: action.choice, status: 'dead' };
      }
      return {
        ...state,
        selected:  action.choice,
        score:     state.score + (1 * state.multiplier),
        streak:    state.streak + 1,
        best:      Math.max(state.best, state.streak + 1),
        multiplier: state.streak + 1 >= 5  ? 3
                  : state.streak + 1 >= 3  ? 2
                  : 1,
        status:    'feedback',
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
    case 'ADD_QUESTIONS':
      return { ...state, questions: [...state.questions, ...action.questions] };
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

  const [state, dispatch]   = useReducer(reducer, init);
  const [loading, setLoading] = useState(true);

  const { index, score, streak, best, multiplier,
          selected, timeLeft, status, questions } = state;

  // Initial question fetch
  useEffect(() => {
    fetchMoreRef.current().then(qs => {
      dispatch({ type: 'ADD_QUESTIONS', questions: qs });
      setLoading(false);
    });
  }, []);

  // Fetch more when running low — keep 5 questions ahead
  useEffect(() => {
    if (questions.length - index < 5 && status === 'playing') {
      fetchMoreRef.current().then(qs => {
        if (qs.length === 0) {
          // No more unique questions — player beat the game
          dispatch({ type: 'COMPLETE' });
        } else {
          dispatch({ type: 'ADD_QUESTIONS', questions: qs });
        }
      });
    }
  }, [index, questions.length, status]);

  // Timer
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

  // Feedback pause → next
  useEffect(() => {
    if (status !== 'feedback') return;
    const t = setTimeout(() => {
      if (index + 1 >= questions.length) {
        dispatch({ type: 'COMPLETE' }); // ran out of questions
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