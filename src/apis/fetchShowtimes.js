import { fetchData, updateData, deleteData, createData } from '../customHook/callApi';

export const fetchShowtimes = async () => {
    return fetchData('/showtimes');
};
export const updateShowtime = async (id, updatedData) => {
    return updateData(`/showtimes/${id}`, updatedData);
};

export const deleteShowtime = async (id) => {
    return deleteData(`/showtimes/${id}`);
};

export const createShowtime = async (newShowtimeData) => {
    return createData('/showtimes', newShowtimeData);
};