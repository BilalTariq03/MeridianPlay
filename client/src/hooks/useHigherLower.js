import { useReducer, useEffect } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'ANSWER':
      return {
        ...state,
        selected:  action.side,
        score:     action.isCorrect ? state.score + 1 : state.score,
        status:    'feedback',
        history:   [...state.history, {
          correct:   action.isCorrect,
          answer:    action.answer.name,
          chosen:    action.chosen,
          timeSpent: action.timeSpent,
        }],
      };

    case 'NEXT': {
      const { left, right, newSide, poolIndex } = state;
      const next = action.nextCountry;
      // The country on newSide is "new" this round — it stays in its position.
      // The country on the OTHER side is "old" — it gets replaced by the next country.
      const nextNewSide = newSide === 'left' ? 'right' : 'left';
      return {
        ...state,
        left:       nextNewSide === 'left'  ? next : left,
        right:      nextNewSide === 'right' ? next : right,
        newSide:    nextNewSide,
        poolIndex:  poolIndex + 1,
        roundIndex: state.roundIndex + 1,
        selected:   null,
        timeLeft:   action.questionTime,
        status:     'playing',
      };
    }

    case 'FINISH':
      return { ...state, status: 'finished' };

    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };

    default:
      return state;
  }
}

export function useHigherLower(countries, questionTime = 10) {
  // countries[1] is the first "new" country, introduced on the right
  const init = {
    left:       countries[0],
    right:      countries[1],
    newSide:    'right',
    poolIndex:  2,
    roundIndex: 0,
    score:      0,
    selected:   null,
    timeLeft:   questionTime > 0 ? questionTime : 999,
    status:     'playing',
    history:    [],
  };

  const [state, dispatch] = useReducer(reducer, init);
  const { left, right, poolIndex, roundIndex, score, selected, timeLeft, status, history } = state;
  const total = countries.length - 1;

  // Per-question countdown timer
  useEffect(() => {
    if (status !== 'playing') return;
    if (questionTime <= 0) return;

    const isTimeUp = timeLeft === 0;
    const t = setTimeout(() => {
      if (isTimeUp) {
        const higher = left.population > right.population ? left : right;
        dispatch({
          type:      'ANSWER',
          side:      null,
          isCorrect: false,
          answer:    higher,
          chosen:    null,
          timeSpent: questionTime,
        });
      } else {
        dispatch({ type: 'TICK' });
      }
    }, isTimeUp ? 0 : 1000);

    return () => clearTimeout(t);
  }, [timeLeft, status, questionTime, left, right]);

  // Feedback pause: advance chain or finish
  useEffect(() => {
    if (status !== 'feedback') return;
    const t = setTimeout(() => {
      if (roundIndex + 1 >= total) {
        dispatch({ type: 'FINISH' });
      } else {
        dispatch({ type: 'NEXT', questionTime, nextCountry: countries[poolIndex] });
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [status, roundIndex, total, questionTime, poolIndex, countries]);

  const handleAnswer = (side) => {
    if (status !== 'playing') return;
    const picked = side === 'left' ? left : right;
    const higher = left.population > right.population ? left : right;
    dispatch({
      type:      'ANSWER',
      side,
      isCorrect: picked.name === higher.name,
      answer:    higher,
      chosen:    picked.name,
      timeSpent: questionTime > 0 ? questionTime - timeLeft : null,
    });
  };

  return {
    question:    left && right ? { left, right } : null,
    index:       roundIndex,
    score,
    selected,
    timeLeft,
    status,
    total,
    history,
    handleAnswer,
  };
}
