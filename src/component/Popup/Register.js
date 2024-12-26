import React, { useState } from 'react';
import './Register.scss';
import { MdPerson } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdPhoneEnabled } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

const Register = ({ onClose, isOpen, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('active');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    const newUser = {
      Name: name,
      Password: password,
      Email: email,
      Phone: phone,
      Role: 'customer',
      CreateAt: new Date().toISOString(),
      Status: status,
    };

    console.log('New User:', newUser);
  };

  if (!isOpen) return null;

  return (
    <div className="register-overlay">
      <div className="register-container">
        <h2>Đăng Ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group-register">
            <div className='head-input'>Họ và Tên:</div>
            <input
              placeholder="Nhập Tên"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <MdPerson className='icon' />
          </div>
          <div className="form-group-register">
            <div className='head-input'>Email:</div>
            <input
              placeholder="Nhập Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MdOutlineMail className='icon'/>
          </div>
          <div className="form-group-register">
            <div className='head-input'>Số Điện Thoại:</div>
            <input
              placeholder="Nhập Số Điện Thoại"
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            /><MdPhoneEnabled className='icon'/>
          </div>
          <div className="form-group-register">
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
          <div className="form-group-register">
            <div className='head-input'>Xác Nhận Mật Khẩu:</div>
            <input
              placeholder="Xác Nhận Mật Khẩu"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            /><GiConfirmed className='icon'/>
          </div>
          <button onClick={onClose} className="close-btn-regi">Đóng</button>
          <button className='submit-btn-regi'type="submit">Đăng Ký</button>
        </form>
        <div className="switch-container">
          <div className='switch-line-regi'>Bạn đã có tài khoản ?</div>
          <button onClick={onSwitchToLogin} className="switch-btn-regi">
            Đăng Nhập
          </button>
        </div>
       
      </div>
    </div>
  );
};

export default Register;
