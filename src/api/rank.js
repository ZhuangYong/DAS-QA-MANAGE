import fetch from '../utils/fetch';
import apiUrl from "./apiUrl";

export function rankPage(data) {
    return fetch({
        url: apiUrl.API_RANK_LIST,
        method: 'post',
        data
    });
}
export function rankMediaPage(data) {
    return fetch({
        url: apiUrl.API_RANK_MEDIA_LIST,
        method: 'post',
        data
    });
}

export function save(data) {
    return fetch({
        url: apiUrl.API_RANK_SAVE,
        method: 'post',
        data
    });
}