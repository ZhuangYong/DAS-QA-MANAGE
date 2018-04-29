/*
 * Copyright (c) 2018 J-MAKE.COM All Rights Reserved.FileName: sales.js @author: walljack@163.com @date: 18-2-26 上午10:52 @version: 1.0
 */

import {examsInQasPage, examsPage, page as qasPage} from '../../api/qas';
import {getDefaultPageData, getPageFun} from "../../utils/fun";

export default {
    state: {
        qasPage: getDefaultPageData(),
        examsPage: getDefaultPageData(),
        examsInQasPage: getDefaultPageData(),
    },
    mutations: {
        SET_QAS_PAGE: (state, data) => {
            state.qasPage = data;
        },
        SET_EXAMS_PAGE: (state, data) => {
            state.examsPage = data;
        },
        SET_EXAMS_IN_QAS_PAGE: (state, data) => {
            state.examsInQasPage = data;
        },
    },

    actions: {
        ['qas/RefreshPage']: getPageFun('qasPage', qasPage, 'SET_QAS_PAGE'),
        ['qas/exams/RefreshPage']: getPageFun('examsPage', examsPage, 'SET_EXAMS_PAGE'),
        ['qas/exams/in/qas/RefreshPage']: getPageFun('examsInQasPage', examsInQasPage, 'SET_EXAMS_IN_QAS_PAGE'),
    }
};

