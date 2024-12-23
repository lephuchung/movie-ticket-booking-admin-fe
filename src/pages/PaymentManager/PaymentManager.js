import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './PaymentManager.scss';
import { fetchPayment } from '../../apis/fetchPayment';

const PaymentManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPayments = async () => {
            try {
                const response = await fetchPayment();
                const formattedData = response.map(item => ({
                    PaymentId: item.PaymentId,
                    PaymentStatus: item.PaymentStatus === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán',
                    Amount: formatAmount(item.Amount),
                    PaymentTime: formatDate(item.PaymentTime),
                    PaymentMethod: item.PaymentMethod,
                }));
                setData(formattedData); // Format lại dữ liệu
                setLoading(false);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu thanh toán');
                setLoading(false);
            }
        };

        getPayments();
    }, []); // Chạy một lần khi component mount

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

    const columns = React.useMemo(
        () => [
            {
                Header: 'STT',
                accessor: (row, rowIndex) => rowIndex + 1,
            },
            {
                Header: 'ID',
                accessor: 'PaymentId',
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
            {
                Header: 'Hành động',
                Cell: ({ row }) => (
                    <div>
                        {row.values.PaymentStatus === 'Chưa thanh toán' && (
                            <button className="payment" onClick={() => handlePayment(row.values.PaymentId)}>
                                Thanh toán
                            </button>
                        )}
                        <button className="delete" onClick={() => handleDelete(row.values.PaymentId)}>
                            Xóa
                        </button>
                    </div>
                ),
            },
        ],
        [data] 
    );

    const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa giao dịch với ID: ${id}?`)) {
            setData(data.filter((item) => item.PaymentId !== id));
        }
    };

    const handleDetails = (id) => {
        alert(`Chi tiết thanh toán cho ID: ${id}`);
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="page-container-payment">
            <h1 className="page-title">Quản lý thanh toán</h1>
            <div className="page-main-content">
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
            </div>
        </div>
    );
};

export default PaymentManager;
