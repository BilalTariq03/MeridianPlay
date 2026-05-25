const games = [
  {
    id: 'guess-the-flag',
    title: 'Guess the Flag',
    description: 'See the flag, name the country.',
    emoji: '🚩',
    category: 'geography',
    path: '/games/guess-the-flag',
    apiEndpoint: '/api/questions/flags',
    available: true,
  },
  {
    id: 'guess-the-capital',
    title: 'Guess the Capital',
    description: 'What is the capital of this country?',
    emoji: '🏛️',
    category: 'geography',
    path: '/games/guess-the-capital',
    apiEndpoint: '/api/questions/capitals',
    available: false, // not built yet
  },
  {
    id: 'guess-the-country',
    title: 'Guess the Country',
    description: 'Name the country from its capital.',
    emoji: '🗺️',
    category: 'geography',
    path: '/games/guess-the-country',
    apiEndpoint: '/api/questions/countries',
    available: false, // not built yet
  },
];

export default games;