/*
 * Copyright (c) 2018 J-MAKE.COM All Rights Reserved.FileName: salesOrderPage.js @author: walljack@163.com @date: 18-3-8 上午10:46 @version: 1.0
 */

import {Component} from "vue-property-decorator/lib/vue-property-decorator";
import BasePage from "../../components/common/BasePage";
import {del as delSales} from "../../api/sales";
import {State} from "vuex-class/lib/index";

@Component({name: "SalesOrderPage"})
export default class SalesOrderPage extends BasePage {
    tableAction = 'sales/order/RefreshPage';
    viewRule = [
        {columnKey: 'image', label: '头像', minWidth: 90, imgColumn: 'headImg', inDetail: true},
        {columnKey: 'nickname', label: '昵称', minWidth: 140, sortable: true, inDetail: true},
        {columnKey: 'productName', label: '产品名', minWidth: 120, sortable: true},
        {columnKey: 'orderNo', label: '订单号', minWidth: 280, inDetail: true},
        {columnKey: 'transactionId', label: '支付流水号', minWidth: 170},
        {columnKey: 'dealPrice', label: '订单金额（元）', minWidth: 160, sortable: true},
        {columnKey: 'deviceId', label: '设备编号', minWidth: 280, inDetail: true},
        {columnKey: 'orderStatus', label: '订单状态', formatter: r => {
            if (r.orderStatus === 1) return '未付款';
            if (r.orderStatus === 2) return '已付款';
        }},
        {columnKey: 'subscribeTime', label: '交易时间', minWidth: 170, sortable: true},
        {columnKey: 'payStatus', label: '付款状态', formatter: r => {
            if (r.payStatus === 1) return '创建';
            if (r.payStatus === 2) return '已完成';
        }, inDetail: true},
        {columnKey: 'payType', label: '支付方式', formatter: r => {
            if (r.payType === 1) return '支付宝';
            if (r.payType === 2) return '微信';
        }, inDetail: true},
        {columnKey: 'channel', label: '机型', minWidth: 110, inDetail: true},
        {columnKey: 'channelName', label: '机型名称', minWidth: 110, inDetail: true},
    ];

    tableActionSearch = [
        {column: 'orderNo', label: '请输入订单号', type: 'input', value: ''},
        {column: 'productName', label: '请输入产品名称', type: 'input', value: ''},
        {column: 'transactionId', label: '请输入流水号', type: 'input', value: ''},
        {column: 'payStatus', label: '请选择订单状态', type: 'option', value: '', options: [
            {value: 1, label: '创建'},
            {value: 2, label: '完成'},
        ]}
    ];

    delItemFun = delSales;

    @State(state => state.sales.orderPage) tableData;

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
}