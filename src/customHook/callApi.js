import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const APi_PREFIX = process.env.REACT_APP_API_PREFIX;

export const fetchData = async (link) => {
    try {
        const response = await axios.get(`${API_URL}${APi_PREFIX}${link}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching link ${link}: ${error}`);
        throw error;
    }
};
export const updateData = async (link, data) => {
    try {
        const response = await axios.put(`${API_URL}${APi_PREFIX}${link}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating data at ${link}: ${error}`);
        throw error;
    }
};

export const deleteData = async (link) => {
    try {
        const response = await axios.delete(`${API_URL}${APi_PREFIX}${link}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting data from ${link}: ${error}`);
        throw error;
    }
};

export const createData = async (link, data) => {
    try {
        const response = await axios.post(`${API_URL}${APi_PREFIX}${link}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error creating data at ${link}: ${error}`);
        throw error;
    }
};