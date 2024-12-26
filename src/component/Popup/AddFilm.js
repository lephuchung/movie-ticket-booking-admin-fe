import React, { useState } from 'react';
import './AddFilm.scss';
import { createNowShowing } from '../../apis/fetchNowShowing'; 
import { FaSave } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

const AddFilm = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        Title: '',           
        Description: '',     
        Genre: '',           
        ReleaseDate: '',    
        Rating: '',          
        Duration: '',     
        Director: '',       
        PosterUrl: '',      
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chuyển ReleaseDate sang định dạng ISO 8601 trước khi gửi lên API
        const { ReleaseDate, ...rest } = formData;
        const releaseDate = ReleaseDate; // Chuyển đổi thành ISO string

        // Gửi dữ liệu lên API createNowShowing
        try {
            const newFilmData = { ...rest, ReleaseDate: releaseDate }; // Đảm bảo dữ liệu là đúng format
            await createNowShowing(newFilmData); // Gọi API để thêm phim mới
            onSubmit(newFilmData); // Gọi onSubmit sau khi thêm thành công
            onClose(); // Đóng form popup
        } catch (error) {
            alert('Đã có lỗi xảy ra khi tạo phim mới.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="add-film-overlay">
            <div className="add-film-popup">
                <h2>Thêm Phim Mới</h2>
                <form className='form-flex' onSubmit={handleSubmit}>
                <div className="form-column"> 
                    <label>
                        Tiêu đề:
                        <input
                            type="text"
                            name="Title"  // Đổi thành Title thay vì title
                            value={formData.Title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Chi tiết:
                        <textarea
                            name="Description"  // Đổi thành Description thay vì description
                            value={formData.Description}
                            onChange={handleChange}
                            className="wide-input-addfilm"
                            required
                        />
                    </label>
                    
                    
                    </div>
                    <div className="form-column">
                    <label>
                        Thể loại:
                        <input
                            type="text"
                            name="Genre"  // Đổi thành Genre thay vì genre
                            value={formData.Genre}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Ngày ra mắt (Ngày và Giờ):
                        <input
                            type="datetime-local"
                            name="ReleaseDate"  // Đổi thành ReleaseDate thay vì releaseDateTime
                            value={formData.ReleaseDate}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Thời lượng (phút):
                        <input
                            type="number"
                            name="Duration"  // Đổi thành Duration thay vì duration
                            value={formData.Duration}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Đạo diễn:
                        <input
                            type="text"
                            name="Director"  // Đổi thành Director thay vì director
                            value={formData.Director}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Poster URL:
                        <input
                            type="url"
                            name="PosterUrl"  // Đổi thành PosterUrl thay vì posterUrl
                            value={formData.PosterUrl}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Đánh giá (1-10):
                        <input
                            type="number"
                            name="Rating"  // Đổi thành Rating thay vì rating
                            value={formData.Rating}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            required
                        />
                    </label>
                    
                    <div className="actions">
                        <button 
                        type="submit">
                            <FaSave />
                        </button>
                        <button 
                        type="button" onClick={onClose}>
                            <GiCancel />
                        </button>
                        
                    </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFilm;
