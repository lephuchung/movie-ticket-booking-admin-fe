import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { fetchUser } from '../../apis/fetchUser';
import { fetchTiket, updateTiket, deleteTiket } from '../../apis/fetchTicket';
import { FaTrash, FaSave } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";
import { FaScrewdriverWrench } from "react-icons/fa6";
import './TicketManager.scss';
import '../../style/search.scss';
import '../../style/pagination.scss';
import { useNavigate } from 'react-router';

const TicketManager = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const tickets = await fetchTiket();
                const users = await fetchUser();

                const formattedData = tickets.map(ticket => {
                    const user = users.find(user => user.UserId === ticket.UserId);
                    return {
                        id: ticket.TicketId,
                        seatNumber: ticket.SeatNumber,
                        bookingTime: ticket.BookingTime,
                        totalPrice: ticket.TotalPrice,
                        paymentStatus: ticket.PaymentStatus,
                        userId: ticket.UserId,
                        customerName: user ? user.Name : 'Không xác định',
                        showtimeId: ticket.ShowtimeId,
                        paymentId: ticket.PaymentId,
                    };
                });

                setData(formattedData);
                setFilteredData(formattedData);
            } catch (err) {
                console.error('Error fetching tickets or users:', err);
                setError('Lỗi khi tải dữ liệu vé.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!localStorage.token) navigate("/login")
    }, [localStorage.token])

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchQuery(value);
        setFilteredData(
            data.filter(ticket =>
                ticket.seatNumber.toLowerCase().includes(value) ||
                ticket.paymentStatus.toLowerCase().includes(value)
            )
        );
        setCurrentPage(1);
    };

    const columns = React.useMemo(() => [
        {
            Header: 'STT',
            accessor: (row, rowIndex) => rowIndex + 1,
        },
        {
            Header: 'Mã vé',
            accessor: 'id',
        },
        {
            Header: 'Tên khách hàng',
            accessor: 'customerName',
        },
        {
            Header: '',
            accessor: 'userId',
            Cell: () => null,
        },
        {
            Header: 'Số ghế',
            accessor: 'seatNumber',
        },
        {
            Header: 'Thời gian đặt',
            accessor: 'bookingTime',
            Cell: ({ value }) => new Date(value).toLocaleString('vi-VN'),
        },
        {
            Header: 'Tổng giá',
            accessor: 'totalPrice',
        },
        {
            Header: 'Trạng thái thanh toán',
            accessor: 'paymentStatus',
        },
        {
            Header: 'Hành động',
            Cell: ({ row }) => (
                <div>
                    <button className="detail" onClick={() => handleDetails(row.original)}><BiDetail /></button>
                    <button className="edit" onClick={() => openEditPopup(row.original)}><FaScrewdriverWrench /></button>
                    <button className="delete" onClick={() => handleDelete(row.original.id)}><FaTrash /></button>
                </div>
            ),
        },
    ], []);

    const openEditPopup = (ticket) => {
        setEditData({
            id: ticket.id,
            seatNumber: ticket.seatNumber,
            bookingTime: ticket.bookingTime,
            totalPrice: ticket.totalPrice,
            paymentStatus: ticket.paymentStatus,
            showtimeId: ticket.showtimeId,
            paymentId: ticket.paymentId,
            customerName: ticket.customerName,
            userId: ticket.userId,
        });
        setIsEditPopupOpen(true);
    };

    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setEditData(null);
    };

    const handleDetails = (ticket) => {
        alert(`Chi tiết đặt vé:\n
            Mã vé: ${ticket.id}\n
            Tên khách hàng: ${ticket.customerName}\n
            Số ghế: ${ticket.seatNumber}\n
            Thời gian đặt: ${new Date(ticket.bookingTime).toLocaleString('vi-VN')}\n
            Tổng giá: ${ticket.totalPrice} VND\n
            Trạng thái thanh toán: ${ticket.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}\n
            Mã suất chiếu: ${ticket.showtimeId}\n
            Mã thanh toán: ${ticket.paymentId}\n`);
    };


    const handleDelete = async (ticketId) => {
        if (window.confirm('Bạn có chắc muốn xóa vé này không?')) {
            try {
                await deleteTiket(ticketId);
                setData(prevData => prevData.filter(ticket => ticket.id !== ticketId));
                setFilteredData(prevData => prevData.filter(ticket => ticket.id !== ticketId));
            } catch (err) {
                alert('Xóa vé thất bại. Vui lòng thử lại.');
            }
        }
    };

    const handleSave = async () => {
        console.log("editdata", editData)
        try {
            const updatedTicket = {
                SeatNumber: editData.seatNumber,
                BookingTime: editData.bookingTime,
                TotalPrice: editData.totalPrice,
                PaymentStatus: editData.paymentStatus,
                UserId: editData.userId,
                ShowtimeId: editData.showtimeId,
                PaymentId: editData.paymentId,
            };
            console.log("updateticket", updatedTicket)
            await updateTiket(editData.id, updatedTicket);
            console.log("editdata", editData.id, updatedTicket)
            setData((prevData) => {
                const updatedData = prevData.map((item) =>
                    item.id === editData.id ? { ...item, ...editData } : item
                );
                return updatedData;
            });
            setFilteredData(prevData => prevData.map(ticket =>
                ticket.id === editData.id ? { ...ticket, ...editData } : ticket
            ));

            closeEditPopup();
        } catch (error) {
            console.error('Lỗi khi cập nhật phim:', error);
            alert('Cập nhật phim thất bại. Vui lòng thử lại.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevData => ({ ...prevData, [name]: value }));
    };

    const paginatedData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: paginatedData,
    });

    return (
        <div className='page-container-ticket'>
            <h1 className='page-title'>Quản lý vé</h1>
            <div className='page-main-content'>
                <div className='search-container'>
                    <input
                        type="text"
                        placeholder="Tìm kiếm vé..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className='search-box'
                    />
                </div>
                <table {...getTableProps()} className="ticket-table">
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
                <div className='pagination'>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                        className='pagination-btn'
                    >
                        <MdFirstPage />
                    </button>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className='pagination-btn'
                    >
                        <GrFormPrevious />
                    </button>
                    <span>Trang {currentPage}/{totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className='pagination-btn'
                    >
                        <GrFormNext />
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className='pagination-btn'
                    >
                        <MdLastPage />
                    </button>
                    <select
                        value={currentPage}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        className="page-select"
                    >
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <option key={page} value={page}>
                                {page}
                            </option>
                        ))}
                    </select>
                </div>

                {isEditPopupOpen && (
                    <div className="popup-movie-edit-container">
                        <div className="popup-movie-edit-content ">
                            <form className="movie-edit-form">
                                <div className="form-group">
                                    <label>Mã vé:</label>
                                    <input type="text" value={editData.id} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Tên khách hàng:</label>
                                    <input type="text" value={editData.customerName} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Số ghế:</label>
                                    <input
                                        type="text"
                                        name="seatNumber"
                                        value={editData.seatNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tổng giá:</label>
                                    <input
                                        type="number"
                                        name="totalPrice"
                                        value={editData.totalPrice}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái thanh toán:</label>
                                    <select
                                        name="paymentStatus"
                                        value={editData.paymentStatus}
                                        onChange={handleInputChange}
                                    >
                                        <option value="paid">Đã thanh toán</option>
                                        <option value="pending">Chưa thanh toán</option>
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button className='save-btn' type="button" onClick={handleSave}><FaSave /></button>
                                    <button className='cancel-btn' type="button" onClick={closeEditPopup}><GiCancel /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketManager;
