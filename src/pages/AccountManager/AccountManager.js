import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './AccountManager.scss';
import { fetchUser, deleteUser } from '../../apis/fetchUser'; 

const AccountManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await fetchUser(); 
                const formattedData = users.map((user) => ({
                    id: user.UserId,
                    name: user.Name,
                    email: user.Email,
                    phone: user.Phone,
                    role: user.Role,
                    createdAt: new Date(user.CreateAt).toLocaleDateString('vi-VN'), // Chuyển định dạng ngày
                    status: user.Status,
                }));
                setData(formattedData);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu người dùng.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); 

    const handleDelete = async (id) => {
      if (window.confirm(`Bạn có chắc muốn xóa tài khoản với ID: ${id}?`)) {
          try {
              await deleteUser(id);
              setData((prevData) => prevData.filter((item) => item.id !== id));
  
              alert('Xóa tài khoản thành công!');
          } catch (err) {
              console.error('Lỗi khi xóa tài khoản:', err);
              alert('Xóa tài khoản thất bại. Vui lòng thử lại.');
          }
      }
    };
  

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
                Header: 'Tên tài khoản',
                accessor: 'name',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Điện thoại',
                accessor: 'phone',
            },
            {
                Header: 'Quyền',
                accessor: 'role',
            },
            {
                Header: 'Ngày tạo',
                accessor: 'createdAt',
            },
            {
                Header: 'Trạng thái',
                accessor: 'status',
            },
            {
                Header: 'Hành động',
                Cell: ({ row }) => (
                    <div>
                        <button className="delete" onClick={() => handleDelete(row.original.id)}>
                            Xóa
                        </button>
                    </div>
                ),
            },
        ],
        [data]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="page-container-acc">
            <h1 className="page-title">Quản lý tài khoản</h1>
            <div className="page-main-content">
                <table {...getTableProps()} className="account-table">
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
            </div>
        </div>
    );
};

export default AccountManager;
