import React from 'react';
import './PaymentManager.scss';

const PaymentManager = () => {

  return (
    <div className="page-container">
      <h1 className="page-title">Quản lý thanh toán</h1>
      <div className="page-main-content">
        <table className="payment-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Tên khách hàng</th>
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
                <td>{item.amount}</td>
                <td>{item.status}</td>
                <td>
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
