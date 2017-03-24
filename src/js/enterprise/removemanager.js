$(function() {
    usermanager.init();
});
var usermanager = {
    $searchInput: $("#searchInput"), //根据关键字进行搜索
    querryObj: { //请求的搜索条件
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    searchObj: {},
    init: function() {
        this.inittable();
        this.bindEvent();
    },
    inittable: function() { //初始化表格
        var that = this;
        $('#table').bootstrapTable({
            url: "/cloudlink-core-framework/user/queryPage?token=" + lsObj.getLocalStorage('token'), //请求数据url
            method: 'post',
            toolbar: "#toolbar",
            toolbarAlign: "left",
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            showHeader: true,
            showRefresh: true,
            striped: true,
            pagination: true, //分页
            sidePagination: 'server', //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 50], //分页步进值
            queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
            // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: function(params) {
                that.searchObj.pageSize = params.pageSize;
                that.searchObj.pageNum = params.pageNumber;
                that.searchObj.enterpriseId = JSON.parse(lsObj.getLocalStorage("userBo")).enterpriseId;
                that.searchObj.status = "1";
                return that.searchObj;
            },
            responseHandler: function(res) {
                return res;
            },
            //表格的列
            columns: [{
                    field: 'userName', //域值
                    title: '姓名',
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle"
                }, {
                    field: 'mobileNum', //域值
                    title: '手机号', //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle"
                }, {
                    field: 'orgName', //域值
                    title: '部门', //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle"
                }, {
                    field: 'roleNames', //域值
                    title: '角色', //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    valign: "middle"
                }, {
                    field: 'position', //域值
                    title: '职位', //内容
                    align: 'center',
                    visible: true, //false表示不显示
                    sortable: false, //启用排序
                    width: '16%',
                    editable: true,
                    valign: "middle"
                },
                {
                    field: 'operation',
                    title: '操作',
                    align: 'center',
                    events: operateEvents,
                    formatter: function(value, row, index) {
                        var s = "";
                        if (row.objectId == JSON.parse(lsObj.getLocalStorage("userBo")).objectId) {
                            s = '<button class="disabledremove"  href="javascript:void(0)" title="移交管理员" disabled>移交管理员</button>';
                        } else {
                            s = '<button class="remove"  href="javascript:void(0)" title="移交管理员">移交管理员</button>';
                        }
                        return [
                            s
                        ].join('');
                    }
                }
            ]
        });
    },
    bindEvent: function() { //绑定监听事件
        var that = this;
        $('#gf_Btn').click(function() {
            var s = $(this).parent().find('input').val();
            that.querryObj.userName = s;
            that.refreshTable();
        });
        /* keyup事件 */
        that.$searchInput.keypress(function(e) {
            if (e && e.keyCode === 13) { // enter 键
                var s = $(this).parent().find('input').val();
                that.querryObj.userName = s;
                that.refreshTable();
            }
        });
        $("#searchInput").bind('keyup', function(event) {
            if (event.keyCode == "8") {
                that.querryObj.userName = ""; //将搜索框里面的内容清空
                that.refreshTable();
            }
        });
    },
    refreshTable: function() { //根据条件进行筛选
        var that = this;
        that.querryObj.pageNum = '1';
        $('#table').bootstrapTable('refreshOptions', {
            pageNumber: +that.querryObj.pageNum,
            pageSize: +that.querryObj.pageSize,
            queryParams: function(params) {
                that.querryObj.pageSize = params.pageSize;
                that.querryObj.pageNum = params.pageNumber;
                that.querryObj.enterpriseId = JSON.parse(lsObj.getLocalStorage("userBo")).enterpriseId;
                that.querryObj.status = "1";
                return that.querryObj;
            }
        });
    },
}
window.operateEvents = {
    'click .remove': function(e, value, row, index) {
        var defaultOptions = {
            tip: '移交后，您将不在拥有管理员权限，确定移交？',
            name_title: '提示',
            name_cancel: '取消',
            name_confirm: '确定',
            isCancelBtnShow: true,
            callBack: function() {
                $.ajax({
                    url: "/cloudlink-core-framework/user/changeEnpAdmin",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify({
                        'enterpriseId': row.enterpriseId,
                        'to': row.objectId,
                        'from': JSON.parse(lsObj.getLocalStorage("userBo")).objectId
                    }),
                    type: "post",
                    dataType: "json",
                    success: function(data, status) {
                        if (data.success == 1) {
                            xxwsWindowObj.xxwsAlert("移交成功");
                        } else {
                            xxwsWindowObj.xxwsAlert("网络异常，请稍候尝试");
                        }
                    }
                });
            }
        };
        xxwsWindowObj.xxwsAlert(defaultOptions);
    },

};