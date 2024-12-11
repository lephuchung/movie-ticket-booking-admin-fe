import { fetchData } from '../customHook/callApi';

export const fetchNowShowing = async () => {
    return fetchData('/movies/now-showing');
};
