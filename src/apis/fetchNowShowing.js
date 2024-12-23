import { fetchData } from '../customHook/callApi';

export const fetchNowShowing = async () => {
    return fetchData('/api/v1/movies');
};
