import React from 'react'
import "./ShowtimeFilter.scss"

const ShowtimeFilter = ({filter, setFilter}) => {
    return (
        <span>
            Search:{' '}
            <input value={filter || ''}
            onChange={e=> setFilter(e.target.value)}/>
        </span>

    )
}

export default ShowtimeFilter