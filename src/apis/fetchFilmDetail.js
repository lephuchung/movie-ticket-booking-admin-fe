import { fetchData } from '../customHook/callApi';

export const fetchFilmDetail = async (filmId) => {
    return fetchData(`/api/v1/movies/details/${filmId}`);
};
