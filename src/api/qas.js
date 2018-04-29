import fetch from '../utils/fetch';
import md5 from 'md5';
import apiUrl from "./apiUrl";

export function page(data) {
    return fetch({
        url: apiUrl.API_GET_QAS_PAGE,
        method: 'post',
        data
    });
}

export function examsPage(data) {
    return fetch({
        url: apiUrl.API_GET_EXAMS_PAGE,
        method: 'post',
        data
    });
}
export function examsInQasPage(data) {
    return fetch({
        url: apiUrl.API_GET_EXAMS_IN_QAS_PAGE,
        method: 'post',
        data
    });
}
export function examsItems(data) {

       return fetch({
        url: apiUrl.API_GET_EXAM_ITEMS,
        method: 'post',
        data
    });
}

export function deleteQa(id) {
    return fetch({
        url: apiUrl.API_GET_QAS_DELETE,
        method: 'post',
        data: {id: id}
    });
}

export function deleteExams(id) {
    return fetch({
        url: apiUrl.API_GET_EXAMS_DELETE,
        method: 'post',
        data: {id: id}
    });
}

export function save(data) {
    return fetch({
        url: apiUrl.API_GET_QAS_SAVE,
        method: 'post',
        data
    });
}

export function saveExam(data) {
    return fetch({
        url: apiUrl.API_GET_QAS_EXAM_SAVE,
        method: 'post',
        data
    });
}
