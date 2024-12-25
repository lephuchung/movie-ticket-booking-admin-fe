import { fetchData, deleteData, updateData } from '../customHook/callApi';

export const fetchPayment = async () => {
    return fetchData('/api/v1/payment');
};

export const updatePayment = async (id, updatedData) => {
    return updateData(`/api/v1/payment/${id}`, updatedData);
};

export const deletePayment = async (id) => {
    return deleteData(`/api/v1/payment/${id}`);
};