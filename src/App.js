import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Showtime from './pages/ShowtimeManagement/Showtime';
import Sidebar from './component/Sidebar/Sidebar';
import Movie from './pages/MovieManagement/Movie';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import AccountManager from './pages/AccountManager/AccountManager'
import PaymentManager from './pages/PaymentManager/PaymentManager'
import TicketManager from './pages/TicketManager/TicketManager'
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer
          progressClassName="toastProgress"
          bodyClassName="toastBody"
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <header className="App-header">
          <Sidebar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
          <div className='page-content'>
            <Routes>
              <Route path='/login' element={<Login setIsSignedIn={setIsSignedIn} />} />
              <Route path='/account' element={<AccountManager />} />
              <Route path='/payment' element={<PaymentManager />} />
              <Route path='/showtime' element={<Showtime />} />
                <Route path='/ticket' element={<TicketManager />} />
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
