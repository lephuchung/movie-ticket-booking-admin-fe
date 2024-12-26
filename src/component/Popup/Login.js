import React, { useState } from 'react';
import './Login.scss';
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = ({ onSwitchToRegister, onClose, isOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API hoặc xử lý đăng nhập ở đây
    console.log('Email:', email, 'Password:', password);
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-container">
        <h2>Đăng Nhập Tài Khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group-login">
            <div className='head-input'>Email:</div>
            <input
              type="email"
              id="email"
              placeholder="Nhập Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MdOutlineMail className='icon'/>
          </div>
          <div className="form-group-login">
            <div className='head-input'>Mật khẩu:</div>
            <input
              placeholder="Nhập Mật Khẩu"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <RiLockPasswordFill className='icon'/>
          </div>
          <button onClick={onClose} className="close-btn-login">Đóng</button>
          <button 
          className='submit-btn-login'
          type="submit">Đăng Nhập</button> 
        </form>
        <div className="switch-container">
          <div className='switch-line-login'>Bạn chưa có tài khoản ?</div>
          <button onClick={onSwitchToRegister} className="switch-btn-login">
            Đăng ký
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
