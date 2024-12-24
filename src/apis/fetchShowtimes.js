import { fetchData, updateData, deleteData, createData } from '../customHook/callApi';

export const fetchShowtimes = async () => {
    return fetchData('/api/v1/showtimes');
};
export const updateShowtime = async (id, updatedData) => {
    return updateData(`/api/v1/showtimes/${id}`, updatedData);
};

export const deleteShowtime = async (id) => {
    return deleteData(`/api/v1/showtimes/${id}`);
};

export const createShowtime = async (newShowtimeData) => {
    return createData('/api/v1/showtimes', newShowtimeData);
};