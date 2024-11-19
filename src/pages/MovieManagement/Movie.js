import React from 'react';
import { useTable } from 'react-table';
import './Movie.scss';

const Movie = () => {
  const data = React.useMemo(
    () => [
      { id: 1, title: 'Avengers: Endgame', status: 'Đang chiếu' },
      { id: 2, title: 'Inception', status: 'Kết thúc' },
      { id: 3, title: 'The Dark Knight', status: 'Đang chiếu' },
      { id: 4, title: 'Interstellar', status: 'Kết thúc' },
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
        Header: 'Trạng thái',
        accessor: 'status',
      },
      {
        Header: 'Hành động',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleDetails(row.values.id)}>Chi tiết</button>
            <button onClick={() => handleEdit(row.values.id)}>Sửa</button>
            <button onClick={() => handleDelete(row.values.id)}>Xóa</button>
          </div>
        ),
      },
    ],
    []
  );

  const handleDetails = (id) => alert(`Chi tiết cho phim ID: ${id}`);
  const handleEdit = (id) => alert(`Sửa phim với ID: ${id}`);
  const handleDelete = (id) => alert(`Xóa phim với ID: ${id}`);

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
            </div>
    </div>
  );
};

export default Movie;
