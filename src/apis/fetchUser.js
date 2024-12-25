import { fetchData, updateData, deleteData, createData } from '../customHook/callApi';

export const fetchUser = async () => {
    return fetchData('/api/v1/users');
};

export const updateUser = async (id, updatedData) => {
    return updateData(`/api/v1/users/${id}`, updatedData);
};

export const createUser = async (newUserData) => {
    return createData('/api/v1/users', newUserData);
};

export const deleteUser = async (id) => {
    return deleteData(`/api/v1/users/${id}`);
};