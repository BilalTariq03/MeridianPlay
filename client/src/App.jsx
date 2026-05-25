import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuessTheFlag from './games/guess-the-flag/GuessTheFlag';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/guess-the-flag" element={<GuessTheFlag />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;