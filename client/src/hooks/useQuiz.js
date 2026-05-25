import { useReducer, useEffect } from 'react';

const QUESTION_TIME = 10;

// All state transitions in one place — explicit and predictable
function reducer(state, action) {
  switch (action.type) {
    case 'ANSWER':
      return {
        ...state,
        selected: action.choice,
        score: action.isCorrect ? state.score + 1 : state.score,
        status: 'feedback',
      };
    case 'NEXT':
      return {
        ...state,
        index: state.index + 1,
        selected: null,
        timeLeft: QUESTION_TIME,
        status: 'playing',
      };
    case 'FINISH':
      return { ...state, status: 'finished' };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    default:
      return state;
  }
}

const init = {
  index: 0,
  score: 0,
  selected: null,
  timeLeft: QUESTION_TIME,
  status: 'playing',
};

export function useQuiz(questions) {
  const [state, dispatch] = useReducer(reducer, init);
  const { index, score, selected, timeLeft, status } = state;

  // Timer — all dispatch calls are inside setTimeout (async, not in effect body directly)
  useEffect(() => {
    if (status !== 'playing') return;

    const isTimeUp = timeLeft === 0;
    const t = setTimeout(() => {
      dispatch(
        isTimeUp
          ? { type: 'ANSWER', choice: null, isCorrect: false } // time's up = wrong
          : { type: 'TICK' }
      );
    }, isTimeUp ? 0 : 1000);

    return () => clearTimeout(t);
  }, [timeLeft, status]);

  // After feedback pause → next question or finish
  useEffect(() => {
    if (status !== 'feedback') return;
    const t = setTimeout(() => {
      dispatch(
        index + 1 >= questions.length
          ? { type: 'FINISH' }
          : { type: 'NEXT' }
      );
    }, 1000);
    return () => clearTimeout(t);
  }, [status, index, questions.length]);

  // Called by the UI when user clicks an option
  const handleAnswer = (choice) => {
    if (status !== 'playing') return;
    const isCorrect = choice === questions[index]?.answer;
    dispatch({ type: 'ANSWER', choice, isCorrect });
  };

  return {
    question: questions[index],
    index,
    score,
    selected,
    timeLeft,
    status,
    total: questions.length,
    handleAnswer,
  };
}