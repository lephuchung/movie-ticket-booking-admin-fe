import { fetchData, updateData, deleteData, createData } from '../customHook/callApi';

export const fetchUser = async () => {
    return fetchData('/users');
};

export const updateUser = async (id, updatedData) => {
    return updateData(`/users/${id}`, updatedData);
};

export const createUser = async (newUserData) => {
    return createData('/users', newUserData);
};

export const deleteUser = async (id) => {
    return deleteData(`/users/${id}`);
};