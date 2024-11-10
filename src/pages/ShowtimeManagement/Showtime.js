import React from 'react'
import "./Showtime.scss"
import ShowtimeList from '../../component/ShowtimeList/ShowtimeList'
import ShowtimeFilter from '../../component/ShowtimeFilter/ShowtimeFilter'

const Showtime = () => {
    return (
        <div className='page-container'>
            <h1 className='page-title'>Quản lý suất chiếu</h1>
            <div className='page-main-content'>
                <ShowtimeFilter />
                <ShowtimeList />
            </div>
        </div>
    )
}

export default Showtime