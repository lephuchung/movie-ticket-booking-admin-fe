import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './Movie.scss';
import AddFilm from '../../component/Popup/AddFilm';
import AddShow from '../../component/Popup/AddShow';
import { fetchNowShowing, deleteNowShowing, updateNowShowing } from '../../apis/fetchNowShowing';
import { FaPlusCircle } from "react-icons/fa";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { BiDetail } from "react-icons/bi";
import { FaScrewdriverWrench } from "react-icons/fa6";

const Movie = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isAddShowPopupOpen, setIsAddShowPopupOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [currentMovieId, setCurrentMovieId] = useState(null);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const movies = await fetchNowShowing(); // Lấy dữ liệu từ API
                const formattedData = movies.map((movie) => ({
                    id: movie.MovieId,
                    title: movie.Title,
                    description: movie.Description,
                    genre: movie.Genre,
                    releaseDate: movie.ReleaseDate.toLocaleString('vi-VN'), 
                    rating: movie.Rating,
                    duration: movie.Duration,
                    director: movie.Director,
                    posterUrl: movie.PosterUrl,
                }));
                setData(formattedData);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Lỗi khi tải dữ liệu phim.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshData]);
    
    const columns = React.useMemo(
        () => [
        {
            Header: 'STT',
            accessor: (row, rowIndex) => rowIndex + 1,
        },
        {
            Header: 'ID',
            accessor: 'id',
        },
        {
            Header: 'Tên Phim',
            accessor: 'title',
        },
        {
            Header: 'Ra mắt',
            accessor: 'releaseDate',
            Cell: ({ value }) => {
                const releaseDateUTC = new Date(value); // Chuyển chuỗi ISO thành đối tượng Date
                const releaseDateUTC7 = new Date(releaseDateUTC.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ để chuyển sang UTC+7

                // Định dạng lại thành ngày/giờ (VD: 25/04/2019 17:00)
                const formattedDate = releaseDateUTC7.toLocaleDateString('vi-VN'); // Chỉ lấy ngày
                const formattedTime = releaseDateUTC7.toLocaleTimeString('vi-VN').slice(0, 5); // Chỉ lấy giờ

                return `${formattedDate} ${formattedTime}`;
            },
        },
        {
            Header: 'Đánh giá',
            accessor: 'rating',
        },
        {
            Header: 'Hành động',
            Cell: ({ row }) => (
            <div>
                <button className="detail" onClick={() => handleDetails(row.original)}><BiDetail /></button>
                <button className="edit" onClick={() => openEditPopup(row.original)}><FaScrewdriverWrench /></button>
                {/* <button className="delete" onClick={() => handleDelete(row.original)}>Xóa</button> */}
                <button className="add" onClick={() => handleAddShow(row.values.id)}><FaRegCalendarPlus /></button>
            </div>
            ),
        },
        ],
        []
    );

    const openEditPopup = (movie) => {
        setEditData({
            id: movie.id,
            title: movie.title,
            description: movie.description,
            genre: movie.genre,
            releaseDate: movie.releaseDate,
            rating: movie.rating,
            duration: movie.duration,
            director: movie.director,
            posterUrl: movie.posterUrl,
        });
        setIsEditPopupOpen(true);
    };

    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setEditData({ id: '', title: '', status: '' });
    };



    const handleDetails = (row) => {
        console.log(row);
        alert(`Chi tiết phim:\n
            Tên phim: ${row.title}\n
            Thể loại: ${row.genre}\n
            Ngày phát hành: ${new Date(row.releaseDate).toLocaleDateString('vi-VN')}\n
            Đánh giá: ${row.rating}\n
            Thời lượng: ${row.duration} phút\n
            Đạo diễn: ${row.director}\n
            Poster: ${row.posterUrl}\n`);
    };
    


    const handleDelete = async (row) => {
        console.log('Xóa phim:', row);
        if (window.confirm(`Bạn có chắc muốn xóa phim "${row.title}" không?`)) {
            try {
                await deleteNowShowing(row.id); // Gọi API để xóa phim với ID của row
                
                // Cập nhật lại dữ liệu sau khi xóa

                setData((prevData) => prevData.filter((item) => item.id !== row.id));
                setRefreshData(prev => !prev);
            } catch (error) {
                alert('Xóa phim thất bại. Vui lòng thử lại.');
            }
        }
    };

    const handleSave = async () => {
        try {
            const updatedMovie = {
                Title: editData.title,
                Description: editData.description,
                Genre: editData.genre,
                ReleaseDate: editData.releaseDate,
                Rating: editData.rating,
                Duration: editData.duration,
                Director: editData.director,
                PosterUrl: editData.posterUrl,
            };
            await updateNowShowing(editData.id, updatedMovie);
            setData((prevData) => {
                const updatedData = prevData.map((item) =>
                    item.id === editData.id ? { ...item, ...updatedMovie } : item
                );
                return updatedData;
            });
            setRefreshData(prev => !prev);
    
            closeEditPopup();
        } catch (error) {
            console.error('Lỗi khi cập nhật phim:', error);
            alert('Cập nhật phim thất bại. Vui lòng thử lại.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleAddFilm = (filmData) => {
        console.log('Dữ liệu phim mới:', filmData);
        window.location.reload();
    };

    const handleAddShow = (movieId) => {
        setCurrentMovieId(movieId);
        setIsAddShowPopupOpen(true);
    };

    const handleAddShowSubmit = (showData) => {
        console.log('Dữ liệu suất chiếu mới:', { ...showData, movieId: currentMovieId });
        setIsAddShowPopupOpen(false);
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    return (
        <div className='page-container-movie'>
            <h1 className='page-title'>Quản lý phim</h1>
            <div className='page-main-content'>
 
                <table {...getTableProps()} className="movie-table">
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                <button className="add-movie-button" onClick={() => setIsAddPopupOpen(true)}>
                    <FaPlusCircle />
                </button>
                <AddFilm
                    isOpen={isAddPopupOpen}
                    onClose={() => setIsAddPopupOpen(false)}
                    onSubmit={handleAddFilm}
                />
               {isEditPopupOpen && (
                <div className="popup-movie-edit-container">
                    <div className="popup-movie-edit-content">
                        <form className="movie-edit-form">
                            <div className="form-group">
                                <label>ID:</label>
                                <input type="text" value={editData.id} disabled />
                            </div>
                            <div className="form-group">
                                <label>Tên phim:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editData.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mô tả:</label>
                                <textarea
                                    name="description"
                                    value={editData.description}
                                    onChange={handleInputChange}
                                    className="wide-input"  
                                />

                            </div>
                            <div className="form-group">
                                <label>Thể loại:</label>
                                <input
                                    type="text"
                                    name="genre"
                                    value={editData.genre}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Ngày phát hành:</label>
                                <input
                                    type="datetime-local"
                                    name="releaseDate"
                                    value={editData.releaseDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Đánh giá:</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={editData.rating}
                                    min="0"
                                    max="10"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Thời lượng (phút):</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={editData.duration}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Đạo diễn:</label>
                                <input
                                    type="text"
                                    name="director"
                                    value={editData.director}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>URL Poster:</label>
                                <input
                                    type="text"
                                    name="posterUrl"
                                    value={editData.posterUrl}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={handleSave}>Lưu</button>
                                <button type="button" onClick={closeEditPopup}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



                {isAddShowPopupOpen && (
                    <AddShow
                        isOpen={isAddShowPopupOpen}
                        onClose={() => setIsAddShowPopupOpen(false)}
                        onSubmit={handleAddShowSubmit}
                        movieId={currentMovieId} 
                    />
                )}
            </div>
        </div>
    );
};

export default Movie;
