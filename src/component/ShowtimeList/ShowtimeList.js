    import React, { useState, useEffect } from 'react';
    import './ShowtimeList.scss';
    import { useTable } from 'react-table';
    import { fetchShowtimes } from '../../apis/fetchShowtimes';
    import { fetchNowShowing } from '../../apis/fetchNowShowing';
    import { updateShowtime, deleteShowtime } from '../../apis/fetchShowtimes'; // Import các hàm API update và delete
    import { BiDetail } from "react-icons/bi";
    import { FaScrewdriverWrench } from "react-icons/fa6";
    import { MdFirstPage } from "react-icons/md";
    import { GrFormPrevious } from "react-icons/gr";
    import { GrFormNext } from "react-icons/gr";
    import { MdLastPage } from "react-icons/md";
    import { FaSave } from "react-icons/fa";
    import { GiCancel } from "react-icons/gi";

    const ShowtimeList = () => {
        const [showtimes, setShowtimes] = useState([]);
        const [movies, setMovies] = useState({});  // Lưu trữ thông tin phim
        const [data, setData] = useState([]);
        const [isPopupOpen, setIsPopupOpen] = useState(false);
        const [currentEdit, setCurrentEdit] = useState(null);
        const [searchTerm, setSearchTerm] = useState(''); 
        const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
        const [pageSize, setPageSize] = useState(6); // Số dòng trên mỗi trang
        
        // Fetch dữ liệu từ API
        useEffect(() => {
            const fetchData = async () => {
                const showtimesData = await fetchShowtimes(); // Lấy danh sách suất chiếu
                const nowShowingData = await fetchNowShowing(); // Lấy danh sách phim đang chiếu
                // Tạo bảng tham chiếu MovieId -> Title
                const movieMap = nowShowingData.reduce((map, movie) => {
                    map[movie.MovieId] = movie.Title;
                    return map;
                }, {});

                setMovies(movieMap);

                // Gắn `title` từ bảng tham chiếu vào dữ liệu showtimes
                const combinedData = showtimesData.map((showtime) => {
                    const startTimeUTC = new Date(showtime.StartTime); // Chuyển ISO string thành đối tượng Date
                    const startTimeUTC7 = new Date(startTimeUTC.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ để chuyển sang UTC+7
                
                    return {
                        ...showtime,
                        id: showtime.ShowtimeId, // ID của suất chiếu
                        title: movieMap[showtime.MovieId] || 'Không xác định', // Tên phim
                        date: startTimeUTC7.toISOString().split('T')[0], // Lấy ngày từ thời gian đã chuyển UTC+7
                        time: startTimeUTC7.toISOString().split('T')[1].slice(0, 5), // Lấy giờ từ thời gian đã chuyển UTC+7
                        price: showtime.Price || '', // Giá
                        seatStatus: showtime.SeatStatus || 'available', // Trạng thái ghế
                    };
                });
                
                console.log('combinedData:', combinedData);
                setShowtimes(combinedData);
                setData(combinedData);
                console.log('showtimes state after set:', showtimes);
                console.log('data state after set:', data);
                
            };

            fetchData();
        }, []);

        // Hàm tìm kiếm dữ liệu
        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
        };

        // Lọc dữ liệu dựa trên từ khóa tìm kiếm
        const filteredData = data.filter((showtime) =>
            showtime.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            showtime.date.includes(searchTerm) || 
            showtime.time.includes(searchTerm)
        );
        const paginatedData = filteredData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );
         // Xử lý chuyển trang
        const handlePageChange = (page) => {
            setCurrentPage(page);
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
                    Header: 'Ngày Chiếu',
                    accessor: 'date',
                },
                {
                    Header: 'Giờ Chiếu',
                    accessor: 'time',
                },
                {
                    Header: 'Hành Động',
                    Cell: ({ row }) => (
                        <div>
                            <button className="detail" onClick={() => handleDetails(row.original)}><BiDetail /></button>
                            <button className="edit" onClick={() => handleEdit(row.original)}><FaScrewdriverWrench /></button>
                            {/* <button className="delete" onClick={() => handleDelete(row.original)}>Xóa</button> */}
                        </div>
                    ),
                },
            ],
            [currentPage, pageSize]
        );
        
        

        // Xử lý các nút hành động
        const handleDetails = (row) => {
            const seatStatusText = row.seatStatus === 'available' ? 'Còn chỗ' : 'Hết chỗ';
            console.log('roworiginal:', row);

            alert(`Chi tiết suất chiếu:\n
                Tên phim: ${row.title}\n
                Ngày chiếu: ${row.date}\n
                Giờ chiếu: ${row.time}\n
                Giá: ${row.price}\n
                Trạng thái: ${seatStatusText}\n
                Rạp chiếu: ${row.TheaterId}\n
                Phòng chiếu: ${row.RoomId}`);

        };
        

        const handleEdit = (showtime) => {
            
            setCurrentEdit({
                id: showtime.id,
                title: showtime.title,
                date: showtime.date,
                time: showtime.time,
                seatStatus: showtime.seatStatus,
                price: showtime.price,
                movieid: showtime.MovieId,
                theaterid: showtime.TheaterId,
                roomid: showtime.RoomId,

            });
            setIsPopupOpen(true);
        };

        const handleDelete = async (row) => {
            console.log('Deleta movie:', row);
            if (window.confirm(`Bạn có chắc muốn xóa suất chiếu của phim "${row.title}" không?`)) {
                try {
                    // Gọi API xóa dữ liệu
                    await deleteShowtime(row.id);
                    
                    // Cập nhật lại dữ liệu sau khi xóa
                    setData((prevData) => prevData.filter((item) => item.id !== row.id));
                    setShowtimes((prevShowtimes) => prevShowtimes.filter((item) => item.id !== row.id));
                } catch (error) {
                    alert('Xóa thất bại. Vui lòng thử lại.');
                }
            }
        };

        const handleSave = async () => {
            try {
                // Kiểm tra nếu dữ liệu chỉnh sửa đầy đủ
                if (!currentEdit.date || !currentEdit.time || !currentEdit.seatStatus || !currentEdit.price ) {
                    alert('Vui lòng điền đầy đủ thông tin.'); 
                    return;
                }
                console.log('CurentEdit when save:', currentEdit); 
                // Chuyển đổi ngày và giờ thành định dạng chuẩn ISO 8601
                const startTime = `${currentEdit.date}T${currentEdit.time}:00.000Z`;  // StartTime
                const endTime = `${currentEdit.date}T${(parseInt(currentEdit.time.split(':')[0]) + 2)}:${currentEdit.time.split(':')[1]}:00.000Z`; // Tạo EndTime sau 2 giờ
                console.log('Starttime:', startTime); 
                console.log('Endtime:', endTime); 
                    // Dữ liệu để cập nhật
                    const updatedData = {
                        ShowtimeId: currentEdit.id,
                        StartTime: startTime,
                        EndTime: endTime,
                        SeatStatus: currentEdit.seatStatus,  // Trạng thái ghế
                        Price: currentEdit.price,  // Giá
                        TheaterId: currentEdit.theaterid,
                        RoomId: currentEdit.roomid,
                        MovieId: currentEdit.movieid,
                    };
                    console.log('Updated Data 4581:', updatedData);
                    // Gọi API cập nhật dữ liệu suất chiếu
    
                    await updateShowtime(currentEdit.id, updatedData);
                // Cập nhật lại UI sau khi thành công
                    const updatedCombinedData = {
                        ...currentEdit,
                        startTime: startTime,
                        endTime: endTime,
                    };
            
                    setData((prevData) =>
                        prevData.map((item) =>
                            item.id === currentEdit.id ? { ...item, ...updatedCombinedData } : item
                        )
                    );
            
                    setShowtimes((prevShowtimes) =>
                        prevShowtimes.map((item) =>
                            item.id === currentEdit.id ? { ...item, ...updatedCombinedData } : item
                        )
                    );
            
                    setIsPopupOpen(false);
            } catch (error) {
                alert('Cập nhật thất bại. Vui lòng thử lại.');
            }
        };
        

        const handleChange = (e) => {
            const { name, value } = e.target;
            setCurrentEdit((prevState) => ({
                ...prevState,
                [name]: value, // Cập nhật giá trị tương ứng
            }));
        };

        // Sử dụng React Table
        const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
            columns,
            data: paginatedData,  // Sử dụng dữ liệu đã lọc
        });

        const totalPages = Math.ceil(filteredData.length / pageSize);
        const renderPagination = () => (
            <div className="pagination">
                <button 
                className='pagination-btn'
                onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    <MdFirstPage />
                </button>
                <button 
                className='pagination-btn'
                onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <GrFormPrevious />
                </button>
                <span>
                    Trang {currentPage}/{totalPages}
                </span>
                <button 
                className='pagination-btn'
                onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <GrFormNext />
                </button>
                <button 
                className='pagination-btn'
                onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    <MdLastPage />
                </button>
                <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="page-select"
                >
                    {Array.from({ length: totalPages }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>
        );
        
    

        return (
            <div>
                <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm suất chiếu..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className='search-box'
                />
                </div>
                <table {...getTableProps()} className="showtime-table">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {renderPagination()}
                {isPopupOpen && currentEdit && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Sửa Suất Chiếu</h2>
                            {console.log('currentEdit:', currentEdit)}
                            <label>
                                Tên Phim:
                                <input
                                    type="text"
                                    name="title"
                                    value={currentEdit.title || ''}
                                    onChange={handleChange}
                                    disabled // Không chỉnh sửa được tên phim
                                />
                            </label>
                            <label>
                                Ngày Chiếu:
                                <input
                                    type="date"
                                    name="date"
                                    value={currentEdit.date || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Giờ Chiếu:
                                <input
                                    type="time"
                                    name="time"
                                    value={currentEdit.time || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Trạng Thái Ghế:
                                <select
                                    name="seatStatus"
                                    value={currentEdit.seatStatus || 'available'}
                                    onChange={handleChange}
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </label>
                            <label>
                                Giá:
                                <input
                                    type="number"
                                    name="price"
                                    value={currentEdit.price || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <div className="popup-actions">
                                <button onClick={handleSave}><FaSave /></button>
                                <button onClick={() => setIsPopupOpen(false)}><GiCancel /></button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        );
    };

    export default ShowtimeList;
