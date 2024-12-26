import React, { useState } from 'react';
import './AddAccount.scss';
import { createUser } from '../../apis/fetchUser';
import { FaSave } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

const AddAccount = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; 

        setIsSubmitting(true); 
        const newAccount = {
            Name: formData.name,
            Password: formData.password,
            Email: formData.email,
            Phone: formData.phone,
            Role: formData.role,
            CreateAt: new Date().toISOString(),
            Status: formData.status,
        };

        try {
            const createdAccount = await createUser(newAccount); // Gửi dữ liệu mà không cần UserId
            onSubmit(createdAccount); // Gọi hàm onSubmit với dữ liệu từ API
            onClose();
        } catch (error) {
            console.error('Lỗi khi tạo tài khoản:', error);
            alert('Tạo tài khoản thất bại. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false); // Mở khóa nút sau khi hoàn thành
        }
    };

    if (!isOpen) return null;

    return (
        <div className="add-account-overlay">
            <div className="add-account-popup">
                <h2>Thêm tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tên tài khoản:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Mật khẩu:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Số điện thoại:
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Quyền:
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <label>
                        Trạng thái:
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                    <div className="actions">
                        <button className='save'type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang lưu...' : <FaSave />}
                        </button>
                        <button className='cancel'type="button" onClick={onClose} disabled={isSubmitting}>
                            <GiCancel />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccount;
