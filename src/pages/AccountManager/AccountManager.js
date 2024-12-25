import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './AccountManager.scss';
import { fetchUser, deleteUser, updateUser } from '../../apis/fetchUser'; 
import { MdDeleteOutline } from "react-icons/md";
import AddAccount from '../../component/Popup/AddAccount';
import { FaPlusCircle } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";

const AccountManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
    const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);  // Để lưu thông tin tài khoản hiện tại cần sửa

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
                   createdAt: user.CreateAt,//toLocaleString('vi-VN'), // Chuyển định dạng ngày
                    status: user.Status,
                    password: user.Passdord,
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

    const handleAddAccountSubmit =  (newAccount) => {
        setData((prevData) => [...prevData, {
            id: newAccount.UserId,
            name: newAccount.Name,
            email: newAccount.Email,
            phone: newAccount.Phone,
            role: newAccount.Role,
            createdAt: newAccount.CreateAt,
            status: newAccount.Status,
        }]);
        window.location.reload();
    };
    
    const handleEditAccount = (account) => {
        console.log("accedit",account)
        setCurrentEdit(account);  // Lưu tài khoản cần sửa vào trạng thái
        setIsEditAccountOpen(true);  // Mở popup chỉnh sửa
    };

    const handleSaveEditedAccount = async (updatedAccount) => {
        console.log("updatedAccount:", updatedAccount);
        try {
            // Chuyển đổi dữ liệu về định dạng mới
            const createdAtUTC = new Date(updatedAccount.createdAt); // Chuyển đổi thành đối tượng Date
            const createdAtWith7Hours = new Date(createdAtUTC.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ
    
            // Định dạng lại createdAt theo chuẩn ISO hoặc theo định dạng bạn muốn
            const formattedCreatedAt = createdAtWith7Hours.toISOString(); // Nếu muốn chuẩn ISO
            // const formattedCreatedAt = createdAtWith7Hours.toLocaleString('vi-VN'); // Hoặc định dạng theo 'vi-VN' nếu cần
    
            const formattedAccount = {
                Name: updatedAccount.name,
                Email: updatedAccount.email,
                Phone: updatedAccount.phone,
                Role: updatedAccount.role,
                CreateAt: formattedCreatedAt, // Gửi thời gian đã format
                Status: updatedAccount.status,
                Password: updatedAccount.password,
            };
    
            console.log("formattedAccount:", formattedAccount);
    
            // Cập nhật thông tin tài khoản qua API
            await updateUser(updatedAccount.id, formattedAccount);  
            window.location.reload();
    
            // Cập nhật lại dữ liệu bảng
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === updatedAccount.id ? { ...item, ...formattedAccount } : item
                )
            );
    
            // Đóng popup sau khi lưu
            setIsEditAccountOpen(false);
    
        } catch (err) {
            console.error('Lỗi khi cập nhật tài khoản:', err);
            alert('Cập nhật tài khoản thất bại.');
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
                Cell: ({ value }) => {
                    const createDateUTC = new Date(value); // Chuyển chuỗi ISO thành đối tượng Date
                    const createDateUTC7 = new Date(createDateUTC.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ để chuyển sang UTC+7
    
                    // Định dạng lại thành ngày/giờ (VD: 25/04/2019 17:00)
                    const formattedDate = createDateUTC7.toLocaleDateString('vi-VN'); // Chỉ lấy ngày
                    const formattedTime = createDateUTC7.toLocaleTimeString('vi-VN').slice(0, 5); // Chỉ lấy giờ
    
                    return `${formattedDate} ${formattedTime}`;
                },
            },
            {
                Header: 'Trạng thái',
                accessor: 'status',
            },
            {
                Header: 'Hành động',
                Cell: ({ row }) => (
                    <div>
                        <button className="edit" onClick={() => handleEditAccount(row.original)}>
                            <FaScrewdriverWrench />
                        </button>
                        {/* <button className="delete" onClick={() => handleDelete(row.original.id)}>
                            <MdDeleteOutline />
                        </button> */}
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
            <button className="add-account-button" onClick={() => setIsAddAccountOpen(true)}>
                    <FaPlusCircle />
                </button>
                <AddAccount
                isOpen={isAddAccountOpen}
                onClose={() => setIsAddAccountOpen(false)}
                onSubmit={handleAddAccountSubmit}
            />
                        {isEditAccountOpen && currentEdit && (
                <div className="edit-account-overlay">
                    <div className="edit-account-popup">
                        <h2>Sửa Tài Khoản</h2>
                        <label>
                            Tên:
                            <input
                                type="text"
                                name="name"
                                value={currentEdit.name || ''}
                                onChange={(e) => setCurrentEdit({ ...currentEdit, name: e.target.value })}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={currentEdit.email || ''}
                                onChange={(e) => setCurrentEdit({ ...currentEdit, email: e.target.value })}
                            />
                        </label>
                        <label>
                            Điện thoại:
                            <input
                                type="text"
                                name="phone"
                                value={currentEdit.phone || ''}
                                onChange={(e) => setCurrentEdit({ ...currentEdit, phone: e.target.value })}
                            />
                        </label>
                        <label>
                            Quyền:
                            <select
                                name="role"
                                value={currentEdit.role || 'customer'}
                                onChange={(e) => setCurrentEdit({ ...currentEdit, role: e.target.value })}
                            >
                                <option value="admin">Admin</option>
                                <option value="customer">Customer</option>
                            </select>
                        </label>
                        <label>
                            Trạng thái:
                            <select
                                name="status"
                                value={currentEdit.status || 'active'}
                                onChange={(e) => setCurrentEdit({ ...currentEdit, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </label>
                        <label>
                            Mật khẩu:
                            <input
                                type="password"
                                name="password"
                                value={currentEdit.password || ''}
                                onChange={(e) => setCurrentEdit({ ...currentEdit, password: e.target.value })}
                            />
                        </label>
                        <div className="actions">
                            <button className='cancel' onClick={() => setIsEditAccountOpen(false)}>Hủy</button>
                            <button className='save' onClick={() => handleSaveEditedAccount(currentEdit)}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountManager;
