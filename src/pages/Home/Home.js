import React, { useEffect, useState } from 'react';
import Login from '../../component/Popup/Login';
import Register from '../../component/Popup/Register';
import { useNavigate } from 'react-router';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.token) navigate("/login")
    }, [localStorage.token])
    return (
        <div>

        </div>
    );
};

export default Home;
