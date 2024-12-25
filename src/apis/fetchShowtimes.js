import { fetchData, updateData, deleteData } from '../customHook/callApi';

export const fetchShowtimes = async () => {
    return fetchData('/api/v1/showtimes');
};
export const updateShowtime = async (id, updatedData) => {
    return updateData(`/api/v1/showtimes/${id}`, updatedData);
};

export const deleteShowtime = async (id) => {
    return deleteData(`/api/v1/showtimes/${id}`);
};