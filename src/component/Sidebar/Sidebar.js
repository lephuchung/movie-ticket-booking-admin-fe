import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Sidebar.scss"
import { IoLogOut } from "react-icons/io5";
import { signOut } from '../../apis/auth';

const Sidebar = ({ isSignedIn, setIsSignedIn }) => {
    const handleSignout = () => {
        signOut();
    }
    return (
        <div className="sidebar">
            <img src="/logo.png" alt="Logo" />
            <NavLink to={'/'}>Trang chủ</NavLink>
            <NavLink to={"/movie"}>Quản lý phim</NavLink>
            <NavLink to={"/showtime"}>Quản lý suất chiếu</NavLink>
            <NavLink to={"/account"}>Quản lý tài khoản</NavLink>
            <NavLink to={"/payment"}>Quản lý thanh toán</NavLink>
            <NavLink to={"/ticket"}>Quản lý vé</NavLink>
            {isSignedIn
                ? <button className="logout-btn" onClick={() => { handleSignout() }}>
                    Đăng xuất <IoLogOut className='icon' />
                </button>
                : <NavLink to="/login" activeClassName="active" className="login-btn">
                    Đăng nhập
                </NavLink>
            }
        </div>
    )
}

export default Sidebar