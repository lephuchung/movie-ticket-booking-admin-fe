import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './Movie.scss';
import AddFilm from '../../component/Popup/AddFilm';
import { fetchNowShowing } from '../../apis/fetchNowShowing';

const Movie = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const movies = await fetchNowShowing(); 
                const formattedData = movies.map((movie) => ({
                    id: movie.MovieId, 
                    title: movie.Title,
                    status: 'Đang chiếu',
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
            Header: 'Trạng thái',
            accessor: 'status',
        },
        {
            Header: 'Hành động',
            Cell: ({ row }) => (
            <div>
                <button onClick={() => handleDetails(row.values.id)}>Chi tiết</button>
                <button className="edit" onClick={() => openEditPopup(row.original)}>Sửa</button>
                <button className="delete" onClick={() => handleDelete(row.values.id)}>Xóa</button>
                <button className="add" onClick={() => handleDelete(row.values.id)}>Tạo suất chiếu</button>
            </div>
            ),
        },
        ],
        []
    );
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [editData, setEditData] = useState({ id: '', title: '', status: '' });

    const openEditPopup = (movie) => {
        setEditData(movie);
        setIsEditPopupOpen(true);
    };

    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setEditData({ id: '', title: '', status: '' });
    };


    const handleDetails = (id) => alert(`Chi tiết cho phim ID: ${id}`);


    const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa phim với ID: ${id}?`)) {
        setData(data.filter((item) => item.id !== id));
        }
    };

    const handleSave = () => {
        setData((prevData) =>
        prevData.map((item) =>
            item.id === editData.id ? { ...item, ...editData } : item
        )
        );
        closeEditPopup();
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
    };
    
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

  return (
    <div className='page-container'>
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
                    + Tạo Phim
                </button>
                <AddFilm
                        isOpen={isAddPopupOpen}
                        onClose={() => setIsAddPopupOpen(false)}
                        onSubmit={handleAddFilm}
                />
                {isEditPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">
                        <h2>Sửa Phim</h2>
                        <form>
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
                            <label>Trạng thái:</label>
                            <select
                                name="status"
                                value={editData.status}
                                onChange={handleInputChange}
                            >
                                <option value="Đang chiếu">Đang chiếu</option>
                                <option value="Kết thúc">Kết thúc</option>
                            </select>
                            </div>
                            <div className="form-actions">
                            <button type="button" onClick={handleSave}>Lưu</button>
                            <button type="button" onClick={closeEditPopup}>Hủy</button>
                            </div>
                        </form>
                        </div>
                    </div>
                )}
            </div>
    </div>
  );
};

export default Movie;
