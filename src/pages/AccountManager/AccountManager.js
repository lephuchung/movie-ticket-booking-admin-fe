import React, { useState } from 'react';
import { useTable } from 'react-table';

const AccountManager = () => {
    const initialData = [
        { id: 1, username: 'Doraemon', email: 'doraemon@gmail.com', role: 'Admin' },
        { id: 2, username: 'Nobita', email: 'nobita@gmail.com', role: 'User' },
        { id: 3, username: 'Shizuka', email: 'shizuka@gmail.com', role: 'User' },
        { id: 4, username: 'Chaien', email: 'chaien@gmail.com', role: 'Admin' },
      ];

    const [data, setData] = useState(initialData);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editData, setEditData] = useState({ id: '', username: '', email: '', role: '' });
    
    const openEditPopup = (account) => {
        setEditData(account);
        setIsEditPopupOpen(true);
    };
    
    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setEditData({ id: '', username: '', email: '', role: '' });
    };
    const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa tài khoản với ID: ${id}?`)) {
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

    const columns = React.useMemo(
        () => [
          { Header: 'STT', accessor: (row, rowIndex) => rowIndex + 1 },
          { Header: 'ID', accessor: 'id' },
          { Header: 'Tên tài khoản', accessor: 'username' },
          { Header: 'Email', accessor: 'email' },
          { Header: 'Quyền', accessor: 'role' },
          {
            Header: 'Hành động',
            Cell: ({ row }) => (
              <div>
                <button onClick={() => openEditPopup(row.original)}>Sửa</button>
                <button className="delete" onClick={() => handleDelete(row.original.id)}>Xóa</button>
              </div>
            ),
          },
        ],
        []
      );

      const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
      });

  return (
    <div className="account-manager">
        <h1 className="title">Quản lý tài khoản</h1>
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

        {isEditPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Sửa Tài Khoản</h2>
            <form>
              <div className="form-group">
                <label>ID:</label>
                <input type="text" value={editData.id} disabled />
              </div>
              <div className="form-group">
                <label>Tên tài khoản:</label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Quyền:</label>
                <select name="role" value={editData.role} onChange={handleInputChange}>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
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
  );
};

export default AccountManager;
