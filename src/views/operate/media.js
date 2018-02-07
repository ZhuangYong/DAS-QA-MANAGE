import {Component} from 'vue-property-decorator';
import BaseView from "../../components/common/BaseView";
import {State} from 'vuex-class';
import MusicPage from "../commPages/musicPage";
import ActorPage from "../commPages/actorPage";
import EditActorPage from "./editPages/editActorPage";
import EditMediaPage from "./editPages/editMediaPage";

/**
 * 主页面
 */
@Component({
    name: 'actorView',
})
export default class Actor extends BaseView {
    @State('operate') stateChannel;
    @State(state => state.channel.channelPage) channelPageChannel;
    created() {
        this.initialPages([<IndexPage/>, <EditActorPage/>, <EditMediaPage/>, <MediaActorPage/>]);
    }
}

/**
 * actor page
 */
@Component
class MediaActorPage extends ActorPage {

    render(h) {
        return <div>
            <div class="filter-container table-top-button-container">
                <el-button class="filter-item" onClick={this.pageBack} type="primary">返回</el-button>
            </div>
            {
                this.topButtonHtml(h)
            }
            {
                this.tableHtml(h)
            }
        </div>;
    }

    /**
     * 跳转到音乐列表
     * @param row
     */
    handelFilterMedia(row) {
        this.pageBackTo("IndexPage", {defaultSearch: [{actorNo: row.actorNo}]});
    }

    handelEdit(row) {
        this.goPage("EditActorPage", {formData: row});
    }
}

/**
 * music page
 */
@Component
class IndexPage extends MusicPage {


    /**
     * 跳转到音乐列表
     * @param row
     */
    handelFilterActor(row) {
        this.goPage("MediaActorPage", {defaultSearch: [{serialNo: row.serialNo}]});
    }

    handelEdit(row) {
        this.goPage("EditMediaPage", {formData: row});
    }
}

