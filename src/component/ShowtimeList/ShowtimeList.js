import React from 'react'
import "./ShowtimeList.scss"
import { useTable } from 'react-table';

const ShowtimeList = () => {
    const data = React.useMemo(
        () => [
          { id: 1, title: 'Avengers: Endgame', time: '2024-11-20 18:30' },
          { id: 2, title: 'Inception', time: '2024-11-21 20:00' },
          { id: 3, title: 'The Dark Knight', time: '2024-11-22 19:45' },
          { id: 4, title: 'Interstellar', time: '2024-11-23 21:00' },
        ],
        []
      );
    
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
            Header: 'Thời Gian Chiếu',
            accessor: 'time',
          },
          {
            Header: 'Hành Động',
            Cell: ({ row }) => (
              <div>
                <button onClick={() => handleDetails(row.values.id)}>Chi tiết</button>
                <button className="edit" onClick={() => handleEdit(row.values.id)}>Sửa</button>
                <button className="delete" onClick={() => handleDelete(row.values.id)}>Xóa</button>
              </div>
            ),
          },
        ],
        []
      );
    
      const handleDetails = (id) => alert(`Xem chi tiết suất chiếu với ID: ${id}`);
      const handleEdit = (id) => alert(`Sửa suất chiếu với ID: ${id}`);
      const handleDelete = (id) => alert(`Xóa suất chiếu với ID: ${id}`);
    
      const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
      });
    return (
        <div>
            <div>ShowtimeList</div>
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
        </div>

    )
}

export default ShowtimeList