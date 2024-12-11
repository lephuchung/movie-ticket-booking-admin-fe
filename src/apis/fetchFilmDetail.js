import { fetchData } from '../customHook/callApi';

export const fetchFilmDetail = async (filmId) => {
    return fetchData(`/movies/details/${filmId}`);
};
