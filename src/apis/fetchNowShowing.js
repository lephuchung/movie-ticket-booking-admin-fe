import { fetchData, createData, deleteData, updateData } from '../customHook/callApi';

export const fetchNowShowing = async () => {
    return fetchData('/api/v1/movies');
};


export const updateNowShowing = async (id, updatedData) => {
    return updateData(`/api/v1/movies/${id}`, updatedData);
};

export const deleteNowShowing = async (id) => {
    return deleteData(`/api/v1/movies/${id}`);
};

export const createNowShowing = async (newMovieData) => {
    return createData('/api/v1/movies', newMovieData);
};