import { fetchData } from '../customHook/callApi';

export const fetchCategoryList = async () => {
    return fetchData('/movies/genres');
};
