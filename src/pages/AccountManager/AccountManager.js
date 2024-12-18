import React from 'react';


const AccountManager = () => {
    const initialData = [
        { id: 1, username: 'nguyenvana', email: 'nguyenvana@gmail.com', role: 'Admin' },
        { id: 2, username: 'tranthib', email: 'tranthib@gmail.com', role: 'User' },
        { id: 3, username: 'phamc', email: 'phamc@yahoo.com', role: 'User' },
        { id: 4, username: 'lequangd', email: 'lequangd@hotmail.com', role: 'Admin' },
      ];
    
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
  return (
    <div className="account-manager">
      
    </div>
  );
};

export default AccountManager;
