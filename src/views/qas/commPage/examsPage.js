import {State} from "vuex-class/lib/index";
import {Component} from "vue-property-decorator/lib/vue-property-decorator";
import {deleteExams, deleteQa} from "../../../api/qas";
import BasePage from "../../../components/common/BasePage";
import Const from "../../../utils/const";


@Component({name: "ExamsPage"})
export default class ExamsPage extends BasePage {
    tableAction = 'qas/exams/RefreshPage';
    viewRule = [
        {columnKey: 'orderNo', label: '题目序号', minWidth: 90, inDetail: true},
        {columnKey: 'examId', label: 'ID', minWidth: 90, inDetail: true},
        {columnKey: 'title', label: '名称', minWidth: 160},
        {imgColumn: 'thumbUrl', ossDomain: Const.OSS_DOM, label: '略缩图', minWidth: 160},
        {columnKey: 'type', label: '类型', minWidth: 90, formatter: r => {
                if (r.type === "exam") return "答题";
                if (r.type === "count") return "问卷统计";
            }},
        {columnKey: 'description', label: '描述', minWidth: 190},
        {columnKey: 'createdBy', label: '发布者ID', minWidth: 90, inDetail: true},
        {columnKey: 'config', label: '配置', minWidth: 120, inDetail: true},
        {columnKey: 'createTime', label: '创建时间', minWidth: 170, inDetail: true},
        {label: '操作', buttons: [{label: '修改', type: 'edit'}, {label: '删除', type: 'del', condition: r => !r.isLeike}], minWidth: 176}
    ];

    tableActionSearch = [
        // {column: 'name', label: '请输入接口名称', type: 'input', value: ''},
    ];

    delItemFun = deleteExams;

    @State(state => state.qas.examsPage) tableData;

    render(h) {
        return <div>
            {
                this.topButtonHtml(h)
            }
            {
                this.tableHtml(h)
            }
        </div>;
    }

    handelEdit(row) {
        this.goPage("EditExamPage", {formData: row});
    }

    handelDel(row) {
        this.submitDel(row, "examId");
    }
}
