import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Sidebar.scss"

const Sidebar = () => {
    return (
        <div className="sidebar">
            <NavLink to={'/'}>Trang chủ</NavLink>
            <NavLink to={"/showtime"}>Quản lý suất chiếu</NavLink>
            <NavLink to={"/movie"}>Quản lý phim</NavLink>
        </div>
    )
}

export default Sidebar