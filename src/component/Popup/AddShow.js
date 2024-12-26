import React, { useState } from 'react';
import './AddShow.scss';
import { createShowtime } from '../../apis/fetchShowtimes';
import { FaSave } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

const AddShow = ({ isOpen, onClose, onSubmit, movieId }) => {
    const [formData, setFormData] = useState({
        startTime: '',
        seatStatus: 'available',
        price: '',
        theaterId: '',
        roomId: '',
        movieId: movieId || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        

        const adjustedFormData = {
            StartTime: formData.startTime,
            EndTime: new Date(new Date(formData.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
            SeatStatus: formData.seatStatus,
            Price: formData.price,
            TheaterId: formData.theaterId,
            RoomId: formData.roomId,
            MovieId: formData.movieId,
        };

        // Log dữ liệu sẽ được gửi
        console.log('Dữ liệu gửi đi:', adjustedFormData);

        createShowtime(adjustedFormData)
            .then(() => {
                onSubmit(adjustedFormData);
                onClose();
            })
            .catch((error) => {
                console.error('Error creating showtime:', error);

            });
    };

    if (!isOpen) return null;

    return (
        <div className="add-show-overlay">
            <div className="add-show-popup">
                <h2>Tạo suất chiếu cho phim có ID: {movieId}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Giờ bắt đầu:
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Trạng thái ghế:
                        <select
                            name="seatStatus"
                            value={formData.seatStatus}
                            onChange={handleChange}
                        >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </label>
                    <label>
                        Giá vé:
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        ID rạp:
                        <input
                            type="number"
                            name="theaterId"
                            value={formData.theaterId}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        ID phòng:
                        <input
                            type="number"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <div className="actions">
                        <button type="submit">
                        <FaSave />
                        </button>
                        <button type="button" onClick={onClose}>
                        <GiCancel />
                        </button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddShow;
