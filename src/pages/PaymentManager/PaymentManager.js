import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './PaymentManager.scss';
import { fetchPayment, deletePayment } from '../../apis/fetchPayment';
import { fetchUser } from '../../apis/fetchUser';
import { MdDeleteOutline } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { MdFirstPage } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { MdLastPage } from "react-icons/md";
import { useNavigate } from 'react-router';

const PaymentManager = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 10; // Số mục mỗi trang

    useEffect(() => {
        const getPayments = async () => {
            try {
                const paymentResponse = await fetchPayment();
                const userResponse = await fetchUser(); // Fetch dữ liệu user

                // Tạo map UserId -> Name 
                const userMap = {};
                userResponse.forEach(user => {
                    userMap[user.UserId] = user.Name;
                });

                // Format dữ liệu payment và thêm tên khách hàng
                const formattedData = paymentResponse.map(item => ({
                    PaymentId: item.PaymentId,
                    PaymentStatus: item.PaymentStatus === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán',
                    Amount: formatAmount(item.Amount),
                    PaymentTime: formatDate(item.PaymentTime),
                    PaymentMethod: item.PaymentMethod,
                    CustomerName: userMap[item.UserId] || 'Không rõ', // Lấy tên khách hàng từ UserId
                }));

                setData(formattedData); // Gán dữ liệu đã format vào state
                setFilteredData(formattedData);
                setLoading(false);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu thanh toán');
                setLoading(false);
            }
        };

        getPayments();
    }, []); // Chạy một lần khi component mount

    useEffect(() => {
        const filtered = data.filter((item) =>
            item.CustomerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.PaymentId.toString().includes(searchQuery) // Tìm kiếm theo ID thanh toán
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    }, [searchQuery, data]);

    useEffect(() => {
        if (!localStorage.token) navigate("/login")
    }, [localStorage.token])

    // Format tiền tệ
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Format thời gian
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    // Xử lý khi thanh toán
    const handlePayment = (id) => {
        setData(data.map(item =>
            item.PaymentId === id
                ? { ...item, PaymentStatus: 'Đã thanh toán' }
                : item
        ));
    };

    // Xử lý xóa thanh toán
    const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa giao dịch với ID: ${id}?`)) {
            setData(data.filter((item) => item.PaymentId !== id));
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const currentPageData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Tính tổng số trang
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


    const columns = React.useMemo(
        () => [
            // {
            //     Header: 'STT',
            //     accessor: (row, rowIndex) => rowIndex + 1,
            // },
            {
                Header: 'ID',
                accessor: 'PaymentId',
            },
            {
                Header: 'Tên khách hàng',
                accessor: 'CustomerName', // Truy cập CustomerName từ dữ liệu
            },
            {
                Header: 'Số tiền',
                accessor: 'Amount',
            },
            {
                Header: 'Thời gian',
                accessor: 'PaymentTime',
            },
            {
                Header: 'Trạng thái',
                accessor: 'PaymentStatus',
            },
            {
                Header: 'Phương thức thanh toán',
                accessor: 'PaymentMethod',
            },
            // {
            //     Header: 'Hành động',
            //     Cell: ({ row }) => (
            //         <div>
            //             {/* {row.values.PaymentStatus === 'Chưa thanh toán' && (
            //                 <button className="payment" onClick={() => handlePayment(row.values.PaymentId)}>
            //                     Thanh toán
            //                 </button>
            //             )}
            //             <button className="delete" onClick={() => handleDelete(row.values.PaymentId)}>
            //                 <MdDeleteOutline />
            //             </button> */}
            //         </div>
            //     ),
            // },
        ],
        [data, currentPage] // Columns phụ thuộc vào dữ liệu
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: currentPageData,
    });

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="page-container-payment">
            <h1 className="page-title">Quản lý thanh toán</h1>
            <div className="page-main-content">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thanh toán..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-box"
                    />
                </div>
                <table {...getTableProps()} className="payment-table">
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
                {renderPagination()}
            </div>
        </div>
    );
    function renderPagination() {
        return (
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
    }
};

export default PaymentManager;
