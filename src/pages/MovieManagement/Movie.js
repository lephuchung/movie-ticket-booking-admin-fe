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
import { MdFirstPage } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { MdLastPage } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import '../../style/search.scss';
import '../../style/pagination.scss';
import { useNavigate } from 'react-router';

const Movie = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

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
                    releaseDate: movie.ReleaseDate,
                    rating: movie.Rating,
                    duration: movie.Duration,
                    director: movie.Director,
                    posterUrl: movie.PosterUrl,
                }));
                setData(formattedData);
                setFilteredData(formattedData);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Lỗi khi tải dữ liệu phim.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshData]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchQuery(value);
        setFilteredData(
            data.filter(movie =>
                movie.title.toLowerCase().includes(value) ||
                movie.genre.toLowerCase().includes(value)
            )
        );
        setCurrentPage(1); // Reset về trang đầu
    };

    const columns = React.useMemo(
        () => [
            // {
            //     Header: 'STT',
            //     accessor: (row, rowIndex) => rowIndex + 1,
            // },
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

                    const formattedDate = releaseDateUTC.toLocaleDateString('vi-VN'); // Chỉ lấy ngày
                    const formattedTime = releaseDateUTC.toLocaleTimeString('vi-VN').slice(0, 5); // Chỉ lấy giờ

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
        [currentPage, rowsPerPage]
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const paginatedData = React.useMemo(() => {
        const filtered = data.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery) ||
            movie.genre.toLowerCase().includes(searchQuery)
        );
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filtered.slice(startIndex, endIndex);
    }, [data, searchQuery, currentPage, rowsPerPage]);


    const totalPages = Math.ceil(filteredData.length / rowsPerPage);


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
        console.log("editdata", editData)
        try {
            const releaseDateUTC = new Date(editData.releaseDate); // Chuyển thành đối tượng Date
            const releaseDateWith7Hours = new Date(releaseDateUTC.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ
            const updatedMovie = {
                Title: editData.title,
                Description: editData.description,
                Genre: editData.genre,
                ReleaseDate: releaseDateWith7Hours.toISOString(),
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
        data: paginatedData,
    });

    useEffect(() => {
        if (!localStorage.token) navigate("/login")
    }, [localStorage.token])

    return (
        <div className='page-container-movie'>
            <h1 className='page-title'>Quản lý phim</h1>
            <div className='page-main-content'>
                <div className='search-container'>
                    <input
                        type="text"
                        placeholder="Tìm kiếm phim..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className='search-box'
                    />
                </div>
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
                <div className='pagination'>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                        className='pagination-btn'
                    >
                        <MdFirstPage />
                    </button>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className='pagination-btn'
                    >
                        <GrFormPrevious />
                    </button>
                    <span>
                        Trang {currentPage}/{totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className='pagination-btn'
                    >
                        <GrFormNext />
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className='pagination-btn'
                    >
                        <MdLastPage />
                    </button>
                    <select
                        value={currentPage}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        className="page-select"
                    >
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <option key={page} value={page}>
                                {page}
                            </option>
                        ))}
                    </select>
                </div>


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
                                    <button className='save-btn' type="button" onClick={handleSave}><FaSave /></button>
                                    <button className='cancel-btn' type="button" onClick={closeEditPopup}><GiCancel /></button>
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
