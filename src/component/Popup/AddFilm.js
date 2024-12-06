import React, { useState } from 'react';
import './AddFilm.scss';

const AddFilm = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        details: '',
        genre: '',
        releaseDate: '',
        rating: '',
        duration: '',
        posterURL: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="add-film-overlay">
            <div className="add-film-popup">
                <h2>Thêm Phim Mới</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tiêu đề:
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Chi tiết:
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Thể loại:
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Ngày ra mắt:
                        <input
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Thời lượng (phút):
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Poster URL:
                        <input
                            type="url"
                            name="posterURL"
                            value={formData.posterURL}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <div className="actions">
                        <button type="button" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFilm;
