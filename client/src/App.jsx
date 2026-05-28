import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameSelect from './pages/GameSelect';
import NotFound from './pages/NotFound';
import GuessTheFlag from './games/guess-the-flag/GuessTheFlag';
import GuessTheCapital from './games/guess-the-capital/GuessTheCapital';
import GuessTheMapCountry from './games/guess-the-map-country/GuessTheMapCountry';
import GuessTheCurrency   from './games/guess-the-currency/GuessTheCurrency';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/:gameId" element={<GameSelect />} />

        <Route path="/play/guess-the-flag"         element={<GuessTheFlag />} />
        <Route path="/play/guess-the-capital"       element={<GuessTheCapital />} />
        <Route path="/play/guess-the-map-country"   element={<GuessTheMapCountry />} />
        <Route path="/play/guess-the-currency"      element={<GuessTheCurrency />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;