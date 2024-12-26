import React, { useCallback, useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { signIn } from "../../apis/auth";


const Login = ({ setIsSignedIn }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loginEmail: "",
        loginPassword: "",
    });
    const clearForm = useCallback(() => {
        setFormData({
            loginEmail: "",
            loginPassword: "",
        });
    }, []);
    // Hàm chung xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            if (!formData.loginEmail.trim() || !formData.loginPassword.trim()) {
                toast.info("Vui lòng nhập đầy đủ email và mật khẩu!")
                return;
            }

            const response = await signIn({
                email: formData.loginEmail,
                password: formData.loginPassword,
            });

            if (response.success) {
                setIsSignedIn(true);
                navigate("/");
            } else {
                toast.error(response.error || "Đăng nhập thất bại! Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau!");

        } finally {
            clearForm();
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Đăng nhập</h2>

                <div className="input-group">
                    <label for="username">Tên đăng nhập</label>
                    <input
                        type="email"
                        id="username"
                        name="loginEmail"
                        placeholder="Nhập email"
                        value={formData.loginEmail}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <label for="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        name="loginPassword"
                        placeholder="Nhập mật khẩu"
                        value={formData.loginPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <button className="login-btn" onClick={handleLogin}>
                    Đăng nhập
                </button>

            </div>
        </div>
    );
};

export default Login;