import { fetchData, updateData, deleteData } from '../customHook/callApi';

export const fetchTiket= async () => {
    return fetchData('/tickets');
};
export const updateTiket = async (id, updatedData) => {
    return updateData(`/tickets/${id}`, updatedData);
};

export const deleteTiket = async (id) => {
    return deleteData(`/tickets/${id}`);
};
