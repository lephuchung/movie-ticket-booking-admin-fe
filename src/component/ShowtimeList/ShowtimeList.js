import React, { useState, useEffect } from 'react';
import './ShowtimeList.scss';
import { useTable } from 'react-table';
import { fetchShowtimes } from '../../apis/fetchShowtimes';
import { fetchNowShowing } from '../../apis/fetchNowShowing';
import { updateShowtime, deleteShowtime } from '../../apis/fetchShowtimes'; // Import các hàm API update và delete

const ShowtimeList = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState({});  // Lưu trữ thông tin phim
    const [data, setData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);
    
    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            const showtimesData = await fetchShowtimes(); // Lấy danh sách suất chiếu
            const nowShowingData = await fetchNowShowing(); // Lấy danh sách phim đang chiếu
            console.log('Showtimes Data:', showtimesData);  // Kiểm tra dữ liệu showtimes
    console.log('Now Showing Data:', nowShowingData);
            // Tạo bảng tham chiếu MovieId -> Title
            const movieMap = nowShowingData.reduce((map, movie) => {
                map[movie.MovieId] = movie.Title;
                return map;
            }, {});

            setMovies(movieMap);

            // Gắn `title` từ bảng tham chiếu vào dữ liệu showtimes
            const combinedData = showtimesData.map((showtime) => ({
                ...showtime,
                id: showtime.ShowtimeId, // ID của suất chiếu
                title: movieMap[showtime.MovieId] || 'Không xác định', // Tên phim
                date: showtime.StartTime.split('T')[0], // Tách ngày từ StartTime
                time: showtime.StartTime.split('T')[1].slice(0, 5), // Tách giờ từ StartTime
                price: showtime.Price || '', // Giá
                seatStatus: showtime.SeatStatus || 'available', // Trạng thái ghế
            }));
            
            setShowtimes(combinedData);
            setData(combinedData);
            
        };

        fetchData();
    }, []);

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
                        <button className="detail" onClick={() => handleDetails(row.values)}>Chi tiết</button>
                        <button className="edit" onClick={() => handleEdit(row.values)}>Sửa</button>
                        <button className="delete" onClick={() => handleDelete(row.values)}>Xóa</button>
                    </div>
                ),
            },
        ],
        []
    );
    
    

    // Xử lý các nút hành động
    const handleDetails = (row) => {
        alert(`Chi tiết suất chiếu:\n
               Tên phim: ${row.title}\n
               Ngày chiếu: ${row.date}\n
               Giờ chiếu: ${row.time}\n`);
    };
    

    const handleEdit = (showtime) => {

        setCurrentEdit({
            id: showtime.id,
            title: showtime.title,
            date: showtime.date,
            time: showtime.time,
            seatStatus: showtime.seatStatus,
            price: showtime.price, // Đảm bảo giá vé được truyền vào
        });
        setIsPopupOpen(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Bạn có chắc muốn xóa suất chiếu của phim "${row.title}" không?`)) {
            try {
                // Gọi API xóa dữ liệu
                await deleteShowtime(row.id);

                // Cập nhật lại dữ liệu sau khi xóa
                setData(data.filter((item) => item.id !== row.id));
            } catch (error) {
                alert('Xóa thất bại. Vui lòng thử lại.');
            }
        }
    };

    const handleSave = async () => {
        try {
            // Kiểm tra nếu dữ liệu chỉnh sửa đầy đủ
            if (!currentEdit.date || !currentEdit.time || !currentEdit.seatStatus || !currentEdit.price || !currentEdit.movieId) {
                alert('Vui lòng điền đầy đủ thông tin.');
                console.log('CurentEdit:', currentEdit);
                return;
            }
    
            // Chuyển đổi ngày và giờ thành định dạng chuẩn ISO 8601
            const startTime = `${currentEdit.date}T${currentEdit.time}:00.000Z`;  // StartTime
            const endTime = `${currentEdit.date}T${(parseInt(currentEdit.time.split(':')[0]) + 2)}:${currentEdit.time.split(':')[1]}:00.000Z`; // Tạo EndTime sau 2 giờ
    
            // Dữ liệu để cập nhật
            const updatedData = {
                StartTime: startTime,
                EndTime: endTime,
                SeatStatus: currentEdit.seatStatus,  // Trạng thái ghế
                Price: currentEdit.price,  // Giá
                MovieId: currentEdit.movieId,  // ID của phim
                TheaterId: currentEdit.theaterId,  // Giả sử TheaterId là từ `currentEdit`
                RoomId: currentEdit.roomId,  // Giả sử RoomId là từ `currentEdit`
            };
    
            // Gọi API cập nhật dữ liệu suất chiếu
            await updateShowtime(currentEdit.id, updatedData);
    
            // Cập nhật lại UI sau khi thành công
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === currentEdit.id ? { ...item, ...updatedData } : item
                )
            );
            setIsPopupOpen(false);  // Đóng popup
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
        data,
    });

    return (
        <div>
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
            {isPopupOpen && currentEdit && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Sửa Suất Chiếu</h2>
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
                                <option value="available">Có sẵn</option>
                                <option value="unavailable">Hết ghế</option>
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
                            <button onClick={handleSave}>Lưu</button>
                            <button onClick={() => setIsPopupOpen(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ShowtimeList;
