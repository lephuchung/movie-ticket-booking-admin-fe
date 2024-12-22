import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Sidebar.scss"

const Sidebar = () => {
    return (
        <div className="sidebar">
            <img src="/logo.png" alt="Logo" />
            <NavLink to={'/'}>Trang chủ</NavLink>
            <NavLink to={"/showtime"}>Quản lý suất chiếu</NavLink>
            <NavLink to={"/movie"}>Quản lý phim</NavLink>
            <NavLink to={"/account"}>Quản lý tài khoản</NavLink>
            <NavLink to={"/payment"}>Quản lý <br/>thanh toán</NavLink>
        </div>
    )
}

export default Sidebar