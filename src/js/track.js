var trackObj = {
    $items: $('.top .item'), //搜索条件dom
    $searchInput: $('#searchInput'), //搜索关键词dom

    tracksIdsArr: [], //存放已被选中的轨迹ID
    defaultObj: { //默认搜索条件
        "status": "1,0", //1:有事件，0：无事件，1,0:全部
        "startDate": new Date().Format('yyyy-MM-dd'), //开始日期
        "endDate": new Date().Format('yyyy-MM-dd'), //结束日期
        "keyword": "", //巡线人，巡线编号
        "userIds": "", //逗号分隔的userId
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    querryObj: { //请求的搜索条件
        "status": "1,0", //1:有事件，0：无事件，1,0:全部
        "startDate": new Date().Format('yyyy-MM-dd'), //开始日期
        "endDate": new Date().Format('yyyy-MM-dd'), //结束日期
        "keyword": "", //巡线人，巡线编号
        "userIds": "", //逗号分隔的userId
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    activeObj: { //高亮默认搜索条件，用于渲染页面
        "status": "1,0",
        "date": "day"
    },
    init: function () {
        var that = this;
        //console.log(that.$items);
        that.renderActive();
        that.bindEvent();
        that.bindDateDiyEvent();
        that.initTable();
    },
    renderActive: function (obj) {
        var that = this;
        if (!obj) {
            obj = that.activeObj;
        }
        for (var key in obj) {
            var $parent = that.$items.parent('[data-class=' + key + ']');
            $parent.find('.item').removeClass('active')
            $parent.find('.item[data-value="' + obj[key] + '"]').addClass('active');
            if (key === 'date') {
                if (obj[key] === 'diy') {
                    $('#item_diy').addClass('active');
                } else {
                    $('#item_diy').removeClass('active');
                }
            }
        }
    },
    bindEvent: function () {
        var that = this;
        /* 选择条件 */
        that.$items.click(function () {
            var key = $(this).parent()[0].dataset.class;
            var value = this.dataset.value;

            if (key === 'date') {
                that.setDate(value);
            } else {
                that.querryObj[key] = value;
            }
            var obj = {};
            obj[key] = value;
            that.renderActive(obj);
            that.refreshTable();

        });

        /* 搜索关键词 */
        $('#gf_Btn').click(function () {
            var s = $(this).parent().find('input').val();
            that.querryObj.keyword = s;
            that.refreshTable();
        });
        /* 显示高级搜索 */
        $('#search_more').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.more_item_wrapper').slideUp();
            } else {
                $(this).addClass('active');
                $('.more_item_wrapper').slideDown();
            }
        });
        /* 清空搜索条件 */
        $('#gf_reset_Btn').click(function () {
            //请求数据还原到初始话
            Object.assign(that.querryObj, that.defaultObj);
            that.renderActive();
            that.refreshTable();
        });
        /* 导出数据 */
        $('#export_all').click(function(){
            that.requestOutput(0);
        });
        $('#export_choice').click(function(){
            that.requestOutput(2);
        });
    },
    bindDateDiyEvent: function () {
        var that = this;
        var $startInput = $("#datetimeStart");
        var $endInput = $("#datetimeEnd");
        $startInput.datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
            // startDate: new Date()
        }).on("click", function () {
            $startInput.datetimepicker("setEndDate", $endInput.val());
        });
        $endInput.datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
            // startDate: new Date()
        }).on("click", function () {
            $endInput.datetimepicker("setStartDate", $startInput.val());
        });

        $('#diyDateBtn').on('click', function () {
            var s = $startInput.val();
            var e = $endInput.val();
            if (!s) {
                alert('请选择开始时间');
                return;
            }
            if (!e) {
                alert('请选择结束时间');
                return;
            }
            that.querryObj.startDate = s;
            that.querryObj.endDate = e;
            that.renderActive({
                'date': 'diy'
            })
            that.refreshTable();
        });
    },
    setDate: function (value) {
        var that = this;
        switch (value) {
            case 'day':
                var date = new Date().Format('yyyy-MM-dd');
                that.querryObj.startDate = date;
                that.querryObj.endDate = date;
                break;
            case 'week':
                var date = new Date();
                that.querryObj.startDate = date.getWeekStartDate().Format('yyyy-MM-dd');
                that.querryObj.endDate = date.getWeekEndDate().Format('yyyy-MM-dd');
                break;
            case 'month':
                var date = new Date();
                that.querryObj.startDate = date.getMonthStartDate().Format('yyyy-MM-dd');
                that.querryObj.endDate = date.getMonthEndDate().Format('yyyy-MM-dd');
                break;
            default:
                that.querryObj.startDate = '';
                that.querryObj.endDate = '';
        }
    },
    setTracksIdsArr: function (row) { //传入单条obj，或多条obj的数组
        var that = this;
        if (row instanceof Array) {
            that.tracksIdsArr = row.map(function (item) {
                return item.objectId;
            })
        } else {
            var s = row.objectId;
            var index = that.tracksIdsArr.indexOf(s);
            if (index === -1) {
                that.tracksIdsArr.push(s);
            } else {
                that.tracksIdsArr.splice(index, 1);
            }
        }
    },
    refreshTable: function () {
        var that = this;
        that.$searchInput.val(that.querryObj.keyword);
        $.ajax({
            type: "POST",
            url: "/cloudlink-inspection-event/inspectionRecord/web/v1/getPageList?token=98059ddb-2f44-4c5c-890c-eba343f6b104",
            contentType: "application/json",
            data: JSON.stringify(that.querryObj),
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.success != 1) {
                    alert('网络连接出错！code:-1')
                    return;
                }
                $('#gf_table').bootstrapTable('load', data)
            },
            statusCode: {
                404: function () {
                    alert('网络连接出错！code:404');
                }
            }
        });
    },
    requestDetails : function(sId){
        var that = this;
        $.ajax({
            type: "GET",
            url: "/cloudlink-inspection-event/eventInfo/web/v1/get",
            contentType: "application/json",
            data: {
                token : '98059ddb-2f44-4c5c-890c-eba343f6b104',
                inspRecordId : sId
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.success != 1) {
                    alert('网络连接出错！code:-1')
                    return;
                }
                that.showModal();

            },
            statusCode: {
                404: function () {
                    alert('网络连接出错！code:404');
                }
            }
        });
    },
    requestOutput: function (flag,sId) {
        //flag :
        // 0 : all
        // 1 : 单条
        // 2 ： 使用数组
        var that = this;
        var obj = {};
        Object.assign(obj, that.querryObj);
        delete obj.pageSize;
        delete obj.pageNum;
        obj.ids = "";
        if (  flag == 1){
            obj.ids = sId;
        }
        if (flag == 2) {
            if( that.tracksIdsArr.length ===  0 ){
                alert('请勾选信息');
                return;
            }
            obj.ids = that.tracksIdsArr.join(',');
        }
        console.log(obj);
        $.ajax({
            type: "POST",
            url: "/cloudlink-inspection-event/inspectionRecord/export?token=98059ddb-2f44-4c5c-890c-eba343f6b104",
            contentType: "application/json",
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data, status) {
                //console.log(data)
                if (data.success != 1) {
                    alert('网络连接出错！code:-1')
                    return;
                }
            },
            complete: function (xhr, txt) {
                //console.log(xhr);
            },
            statusCode: {
                404: function () {
                    alert('网络连接出错！code:404');
                }
            }
        });
    },

    initTable: function () {
        var that = this;
        $('#gf_table').bootstrapTable({
            url: "/cloudlink-inspection-event/inspectionRecord/web/v1/getPageList?token=98059ddb-2f44-4c5c-890c-eba343f6b104", //请求数据url
            method: 'post',
            toolbar: "#toolbar",
            toolbarAlign: "left",
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            striped: true,
            showHeader: true,
            showRefresh: true,
            pagination: true, //分页
            sidePagination: 'server', //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 50], //分页步进值
            search: false, //显示搜索框
            searchOnEnterKey: false,
            sortable: false,
            queryParamsType: '',
            queryParams: function (params) {
                that.querryObj.pageSize = params.pageSize;
                that.querryObj.pageNum = params.pageNumber;
                //console.log(that.querryObj)
                return that.querryObj;
            },
            /*responseHandler : function(res){
                console.log(res);
            },*/
            //表格的列
            columns: [{
                field: 'state', //域值
                checkbox: true, //复选框
                align: 'center',
                valign: 'middle',
                visible: true, //false表示不显示
                sortable: false, //启用排序
                width: '5%',
            }, {
                field: 'name', //域值
                title: '巡线编号', //标题
                align: 'center',
                visible: true, //false表示不显示
                sortable: true, //启用排序
                width: '15%',
                editable: true,
            }, {
                field: 'beginTime', //域值
                title: '开始时间', //内容
                align: 'center',
                visible: true, //false表示不显示
                sortable: true, //启用排序
                width: '15%',
                editable: true,
            }, {
                field: 'endTime', //域值
                title: '结束时间', //内容
                align: 'center',
                visible: true, //false表示不显示
                sortable: true, //启用排序
                width: '15%',
                editable: true,
            }, {
                field: 'inspectorName', //域值
                title: '巡线人', //内容
                align: 'center',
                visible: true, //false表示不显示
                sortable: true, //启用排序
                width: '10%',
                editable: true,
            }, {
                field: 'wholeTime', //域值
                title: '选线总时长', //内容
                align: 'center',
                visible: true, //false表示不显示
                sortable: true, //启用排序
                width: '10%',
                editable: true,
            }, {
                field: 'distance', //域值
                title: '巡线里程', //内容
                align: 'center',
                visible: true, //false表示不显示
                sortable: true, //启用排序
                width: '10%',
                editable: true,
            }, {
                field: 'eventCount', //域值
                title: '事件上报', //内容
                align: 'center',
                visible: true, //false表示不显示
                sortable: true, //启用排序
                width: '10%',
                editable: true,
            }, {
                field: 'operate',
                title: '操作',
                align: 'center',
                events: that.tabelEventObj(),
                width: '10%',
                formatter: that.table_operateFormatter
            }]
        });
        that.table_bindEvent();
    },
    tabelEventObj: function(){
        var that = this;
        return {
            //查看详情
            'click .see': function (e, value, row, index) {
                //console.log(row.objectId)
                //$(this).css("color", "red");
                that.requestDetails(row.objectId)
                //that.showModal();
                return false;
            },
            //导出word
            'click .out': function (e, value, row, index) {
                //console.log(row.objectId)
                that.requestOutput(1,row.objectId);
                return false;
            }
        }
    },
    table_operateFormatter: function (value, row, index) {
        return [
            '<a class="see" href="javascript:void(0)" title="查看">',
            '<i class="glyphicon glyphicon-eye-open"></i>',
            '</a>&nbsp;&nbsp;&nbsp;&nbsp;',
            '<a class="out" href="javascript:void(0)" title="查看">',
            '<i class="glyphicon glyphicon-new-window"></i>',
            '</a>&nbsp;&nbsp;&nbsp;&nbsp;',
        ].join('');
    },
    table_bindEvent: function () {
        var that = this;
        $('#gf_table')
            .on('check.bs.table', function (e, row) { //单选一行
                //console.log(row.objectId);
                that.setTracksIdsArr(row);
                //console.log(that.tracksIdsArr);
                //console.log('选中'+that.tracksIdsArr.indexOf(row.objectId));
            })
            .on('uncheck.bs.table', function (e, row) { //取消单选一行
                //console.log(row.objectId);
                that.setTracksIdsArr(row);
                //console.log(that.tracksIdsArr);
                //console.log('取消'+that.tracksIdsArr.indexOf(row.objectId));
            })
            .on('check-all.bs.table', function (e, rows) { //全选
                that.setTracksIdsArr(rows);
                //console.log(that.tracksIdsArr);
            })
            .on('uncheck-all.bs.table', function (e, rows) { //取消全选
                that.tracksIdsArr = [];
                //console.log(that.tracksIdsArr);
            })
            .on('post-body.bs.table', function () { //取消全选
                that.tracksIdsArr = [];
                //console.log(that.tracksIdsArr);
            })

    },
    showModal : function(){
        var that = this;
        console.log('123')
        $('#gf_detail').modal({});
    }
};
trackObj.init();