import { fetchData } from '../customHook/callApi';

export const fetchUser = async () => {
    return fetchData('/api/v1/users');
};