/*
 * Copyright (c) 2018 J-MAKE.COM All Rights Reserved.FileName: thirdMenu.js @author: walljack@163.com @date: 18-3-15 上午11:06 @version: 1.0
 */

import {Component} from "vue-property-decorator";
import BaseView from "../../components/common/BaseView";
import EditExamPage from "./commPage/editExamPage";
import examsPage from "./commPage/examsPage";

@Component({name: "QasView"})
export default class QasView extends BaseView {
    created() {
        this.initialPages([<IndexPage/>, <EditExamPage/>]);
    }
}

@Component({name: "IndexPage"})
class IndexPage extends examsPage {
}


