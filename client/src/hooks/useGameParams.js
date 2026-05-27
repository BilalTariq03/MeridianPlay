import { useLocation } from 'react-router-dom';

export function useGameParams() {
  const location = useLocation();
  const params   = new URLSearchParams(location.search);

  return {
    mode:       params.get('mode')       || 'classic',
    difficulty: params.get('difficulty') || 'medium',
    questions:  params.get('questions')  || '10',
    timer:      params.get('timer')      || '10',
    timeLimit:  params.get('timeLimit')  || '120',
  };
}