import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import GuessTheFlag from './games/guess-the-flag/GuessTheFlag';
import GuessTheMapCountry from './games/guess-the-map-country/GuessTheMapCountry';
import GuessTheCurrency   from './games/guess-the-currency/GuessTheCurrency';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/guess-the-flag" element={<GuessTheFlag />} /> 
        <Route path="/games/guess-the-map-country" element={<GuessTheMapCountry />} />
        <Route path="/games/guess-the-currency"    element={<GuessTheCurrency />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;