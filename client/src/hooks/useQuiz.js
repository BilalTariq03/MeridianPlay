import { useReducer, useEffect } from 'react';

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
        timeLeft: action.questionTime, // passed through action
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

export function useQuiz(questions, questionTime = 10) {
  const init = {
    index:    0,
    score:    0,
    selected: null,
    timeLeft: questionTime > 0 ? questionTime : null, // null = no timer
    status:   'playing',
  };
  
  const [state, dispatch] = useReducer(reducer, init);
  const { index, score, selected, timeLeft, status } = state;

  // Timer effect — skip entirely if questionTime is 0 (no timer mode)
  useEffect(() => {
    if (status !== 'playing') return;
    if (questionTime === 0) return;  // ∞ mode — no countdown

    const isTimeUp = timeLeft === 0;
    const t = setTimeout(() => {
      dispatch(
        isTimeUp
          ? { type: 'ANSWER', choice: null, isCorrect: false }
          : { type: 'TICK' }
      );
    }, isTimeUp ? 0 : 1000);

    return () => clearTimeout(t);
  }, [timeLeft, status, questionTime]);

  // After feedback — next question or finish
  useEffect(() => {
    if (status !== 'feedback') return;
    const t = setTimeout(() => {
      dispatch(
        index + 1 >= questions.length
          ? { type: 'FINISH' }
          : { type: 'NEXT', questionTime } // pass questionTime so NEXT resets correctly
      );
    }, 1000);
    return () => clearTimeout(t);
  }, [status, index, questions.length, questionTime]);

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