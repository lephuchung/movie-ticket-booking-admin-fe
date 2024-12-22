import React, { useState } from 'react'
import "./ShowtimeList.scss"
import { useTable } from 'react-table';

const ShowtimeList = () => {
     const [data, setData] = useState([
        { id: 1, title: 'Avengers: Endgame', date: '2024-11-20', time: '18:30' },
        { id: 2, title: 'Inception', date: '2024-11-21', time: '20:00' },
        { id: 3, title: 'The Dark Knight', date: '2024-11-22', time: '19:45' },
        { id: 4, title: 'Interstellar', date: '2024-11-23', time: '21:00' },
    ]);

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
                        <button className="detail"onClick={() => handleDetails(row.values.id)}>Chi tiết</button>
                        <button className="edit" onClick={() => handleEdit(row.values.id)}>Sửa</button>
                        <button className="delete" onClick={() => handleDelete(row.values.id)}>Xóa</button>
                    </div>
                ),
            },
        ],
        []
    );

      const [isPopupOpen, setIsPopupOpen] = useState(false); 
      const [currentEdit, setCurrentEdit] = useState(null);

      const handleDetails = (id) => alert(`Xem chi tiết suất chiếu với ID: ${id}`);

      const handleEdit = (id) => {
          const itemToEdit = data.find((item) => item.id === id);
          setCurrentEdit(itemToEdit);
          setIsPopupOpen(true);
      };
  
      const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa phim với ID: ${id}?`)) {
        setData(data.filter((item) => item.id !== id));
        }
      };
      const handleSave = () => {
          setData((prevData) =>
              prevData.map((item) =>
                  item.id === currentEdit.id ? currentEdit : item
              )
          );
          setIsPopupOpen(false);
      };
  
      const handleChange = (e) => {
          const { name, value } = e.target;
          setCurrentEdit({ ...currentEdit, [name]: value });
      };
    
      const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
      });
    return (
        <div>
            <table {...getTableProps()} className="showtime-table">
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
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Sửa Suất Chiếu</h2>
                        <label>
                            Tên Phim:
                            <input
                                type="text"
                                name="title"
                                value={currentEdit.title}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Ngày Chiếu:
                            <input
                                type="date"
                                name="date"
                                value={currentEdit.date}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Giờ Chiếu:
                            <input
                                type="time"
                                name="time"
                                value={currentEdit.time}
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

    )
}

export default ShowtimeList