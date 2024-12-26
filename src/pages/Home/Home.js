import React, { useState } from 'react';
import Login from '../../component/Popup/Login';
import Register from '../../component/Popup/Register';

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const switchToRegister = () => openRegister();
  const switchToLogin = () => openLogin();



  return (
    <div>
        <button onClick={openLogin}>Đăng nhập</button>
        <button onClick={openRegister}>Đăng ký</button>

        <Login 
            isOpen={isLoginOpen} 
            onSwitchToRegister={switchToRegister} 
            onClose={closeAll} 
        />

        <Register
        isOpen={isRegisterOpen}
        onClose={closeAll}
        onSwitchToLogin={switchToLogin}
        />

    </div>
  );
};

export default Home;
