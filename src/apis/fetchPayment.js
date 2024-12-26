import { fetchData, deleteData, updateData } from '../customHook/callApi';

export const fetchPayment = async () => {
    return fetchData('/payment');
};

export const updatePayment = async (id, updatedData) => {
    return updateData(`/payment/${id}`, updatedData);
};

export const deletePayment = async (id) => {
    return deleteData(`/payment/${id}`);
};