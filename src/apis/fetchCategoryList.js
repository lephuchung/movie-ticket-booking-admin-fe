import { fetchData } from '../customHook/callApi';

export const fetchCategoryList = async () => {
    return fetchData('/api/v1/movies/genres');
};
