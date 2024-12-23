import { fetchData, updateData, deleteData } from '../customHook/callApi';

export const fetchUser = async () => {
    return fetchData('/api/v1/users');
};

export const deleteUser = async (id) => {
    return deleteData(`/api/v1/users/${id}`);
};