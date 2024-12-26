import { fetchData, updateData, deleteData } from '../customHook/callApi';

export const fetchTiket= async () => {
    return fetchData('/api/v1/tickets');
};
export const updateTiket = async (id, updatedData) => {
    return updateData(`/api/v1/tickets/${id}`, updatedData);
};

export const deleteTiket = async (id) => {
    return deleteData(`/api/v1/tickets/${id}`);
};