import { fetchData, createData, deleteData, updateData } from '../customHook/callApi';

export const fetchNowShowing = async () => {
    return fetchData('/movies');
};


export const updateNowShowing = async (id, updatedData) => {
    return updateData(`/movies/${id}`, updatedData);
};

export const deleteNowShowing = async (id) => {
    return deleteData(`/movies/${id}`);
};

export const createNowShowing = async (newMovieData) => {
    return createData('/movies', newMovieData);
};