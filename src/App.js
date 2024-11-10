import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Showtime from './pages/ShowtimeManagement/Showtime';
import Sidebar from './component/Sidebar/Sidebar';
import Movie from './pages/MovieManagement/Movie';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Sidebar />
          <div className='page-content'>
            <Routes>
              <Route path='/showtime' element={<Showtime />} />
              <Route path='/movie' element={<Movie />} />
              <Route path='/' element={<Home />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>

        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
