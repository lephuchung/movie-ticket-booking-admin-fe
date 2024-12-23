import { fetchData } from '../customHook/callApi';

export const fetchPayment = async () => {
    return fetchData('/api/v1/payment');
};