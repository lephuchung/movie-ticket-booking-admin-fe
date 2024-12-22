import React, { useState } from 'react';
import './PaymentManager.scss';

const PaymentManager = () => {
    const [data, setData] = useState([
        {
        id: '1',
        customerName: 'Nguyễn Văn A',
        movieTitle: 'Avatar 2',
        showTime: '18:30 20/12/2024',
        amount: '500,000 VND',
        status: 'Đã thanh toán',
        },
        {
        id: '2',
        customerName: 'Trần Thị B',
        movieTitle: 'Spider-Man: No Way Home',
        showTime: '20:00 20/12/2024',
        amount: '300,000 VND',
        status: 'Chưa thanh toán',
        },
        {
        id: '3',
        customerName: 'Lê Văn C',
        movieTitle: 'The Batman',
        showTime: '15:00 19/12/2024',
        amount: '150,000 VND',
        status: 'Đã thanh toán',
        },
        ]);
    const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa giao dịch với ID: ${id}?`)) {
          setData(data.filter((item) => item.id !== id));
        }
        };
    const handlePayment = (id) => {
        setData(data.map(item =>
            item.id === id
            ? { ...item, status: 'Đã thanh toán' }
            : item
            ));
          };

  return (
    <div className="page-container-payment">
        <h1 className="page-title">Quản lý thanh toán</h1>
        <div className="page-main-content">
            <table className="payment-table">
            <thead>
                <tr>
                <th>STT</th>
                <th>ID</th>
                <th>Tên khách hàng</th>
                <th>Tên phim</th>
                <th>Giờ chiếu</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td>{item.customerName}</td>
                    <td>{item.movieTitle}</td>
                    <td>{item.showTime}</td>
                    <td>{item.amount}</td>
                    <td>{item.status}</td>
                    <td>
                    {item.status === 'Chưa thanh toán' && (
                    <button
                      className="payment"
                      onClick={() => handlePayment(item.id)}
                    >
                      Thanh toán
                    </button>
                  )}
                    <button
                        className="delete"
                        onClick={() => handleDelete(item.id)}
                    >
                        Xóa
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default PaymentManager;
