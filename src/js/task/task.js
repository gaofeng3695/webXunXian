$(function() {

    mapObj.init();
    taskObj.init();
    initTable();
    searchObj.init(); //搜索条件

    taskDetailsObj.init();

    /*上传图片*/
    $(".addImg").click(function() {
        var imgNum = $(".feedback_img_list").find(".feedback_images").length;
        if (imgNum <= 4) {
            $("#upload").trigger("click");
        } else {
            alert("最多上传五张图片");
        }

    });

    /*删除图片*/
    function closeImg(e) {
        $(e).closest(".feedback_images").remove();
    }

    $("#map_choice").click(function() {
        // 获取已选的信息
        var tex = $('#table').bootstrapTable('getSelections');
        mapObj.addMark(tex);
        // console.log(JSON.stringify(tex));
    });
});

// 地图的显示隐藏

var mapObj = {
    $token: lsObj.getLocalStorage('token'),
    $user: JSON.parse(lsObj.getLocalStorage("userBo")),
    $mapBtn: $(".bottom_btn span"),
    $mapO: $("#event_map"),
    $mapEvent: new BMap.Map("event_map"), // 创建Map实例
    init: function() {
        console.log(this.$token)
        var _this = this;
        //百度地图API功能
        var point = new BMap.Point(116.404, 38.915);
        this.$mapEvent.centerAndZoom(point, 12);
        this.$mapEvent.enableScrollWheelZoom(); //启用滚轮放大缩小

        var top_right_navigation = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_SMALL
        }); //右上角，仅包含平移和缩放按钮
        this.$mapEvent.addControl(top_right_navigation);
        //点击收缩地图
        this.$mapBtn.click(function() {
            _this.control();
        });
    },
    control: function() {
        if (this.$mapO.is(":hidden")) {
            this.show();
        } else {
            this.hide();
        }
    },
    hide: function() {
        this.$mapO.slideUp();
        this.$mapBtn.attr("class", "map_down");
    },
    show: function() {
        this.$mapO.slideDown();
        this.$mapBtn.attr("class", "map_up");
        this.iconHide();
    },
    setMark: function(data) {
        var txts = null;
        var myIcons = null;
        var markers = null;
        var point = null;
        var label = null;
        for (var i = 0; i < data.length; i++) {
            txts = '<div><p>事件类型：' + data[i].fullTypeName + '</p>' +
                '<p>任务状态：' + data[i].taskStatusDesc + '</p>' +
                '<p>上报人：' + data[i].taskCreateUserName + '</p></div>';

            point = new BMap.Point(data[i].bdLon, data[i].bdLat);
            label = new BMap.Label("" + data[i].eventId, { offset: new BMap.Size(20, -10) });
            label.setStyle({ 'display': 'none' });
            if (data[i].parentTypeId == 1) {
                myIcons = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
            } else if (data[i].parentTypeId == 2) {
                myIcons = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
            } else if (data[i].parentTypeId == 3) {
                myIcons = new BMap.Icon("/src/images/event/pip1.png", new BMap.Size(29, 42));
            }
            markers = new BMap.Marker(point, { icon: myIcons });
            markers.setLabel(label);
            this.$mapEvent.addOverlay(markers);
            this.addClickHandler(txts, markers)
        }
    },
    addMark: function(data) { //加载事件标注点
        this.$mapEvent.clearOverlays(); //清除所以的点
        this.$mapEvent.centerAndZoom(new BMap.Point(data[0].bdLon, data[0].bdLat), 12); //设置中心点
        this.setMark(data);
    },
    getMark: function(data) {
        var allOverlay = this.$mapEvent.getOverlays();
        var numMark = 0;
        var markerNew = null;
        var point = new BMap.Point(data.bdLon, data.bdLat);
        // alert(allOverlay.length);
        for (var i = 0; i < allOverlay.length; i++) {
            if (allOverlay[i].getLabel().content == data.eventId) {
                allOverlay[i].setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                numMark++;
            } else {
                allOverlay[i].setAnimation();
            }
        }
        if (numMark == 0) {
            this.setMark(data);
            // markerNew = new BMap.Marker(point); // 创建标注
            // this.$mapEvent.addOverlay(markerNew); // 将标注添加到地图中
            // markerNew.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        } else {
            this.$mapEvent.removeOverlay(markerNew);
        }
        this.$mapEvent.panTo(point); //中心点跳转
    },
    iconHide: function() { //隐藏百度图标与文字
        $(".BMap_cpyCtrl.BMap_noprint.anchorBL,.anchorBL").hide();
        $(".anchorBL a").hide();
    },
    addClickHandler: function(content, marker) {
        var _this = this;
        marker.addEventListener("click", function(e) {
            // alert(content);
            _this.openInfo(content, e)
        });
    },
    openInfo: function(content, e) {
        var opts = {
            width: 250, // 信息窗口宽度
            height: 80, // 信息窗口高度
            enableMessage: true //设置允许信息窗发送短息
        };
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
        mapObj.$mapEvent.openInfoWindow(infoWindow, point); //开启信息窗口
    }
};

//任务对象，根据任务来操作
var taskObj = {
    $submit: $(".submit"),
    $taskM: $("#dispose"),
    $datatime: $("#datetime"),
    $objectId: null,
    $taskId: null,
    $flg: true,
    init: function() {
        var _this = this;
        this.$submit.click(function() { //事件上报
            _this.submit();
        });
    },
    eventOpen: function(e) { //打开摸态窗口
        this.$taskM.modal();
        var time = (new Date()).Format("yyyy-MM-dd HH:mm");
        this.$datatime.val(time);
        this.$taskId = e.taskId;
    },
    submit: function() { //提交表单
        this.$objectId = baseOperation.createuuid();

        var content = $("#event_description").val().trim();
        var type = $("input[name='taskType']:checked").val();
        var receiveUser = $("input[name='receiveUser']").val();

        if (this.$flg == true) {
            this.$flg = false;
            if (content == "") {
                alert("请描述处置的信息!");
                this.again();
                return false;
            } else if (type == "20") {
                if (receiveUser == '') {
                    alert("请选择【请示】消息的接收人！");
                    this.again();
                    return false;
                }
            } else {
                this.uploadFile();
            }
        }

    },
    uploadFile: function() {
        var nImgHasBeenSendSuccess = 0;
        var _this = this;
        var files = $(".feedback_img_list").find("input[name=file]");
        if (files.length > 0) {
            for (i = 0; i < files.length; i++) {
                var picId = files.eq(i).attr("id");
                $.ajaxFileUpload({
                    url: "/cloudlink-core-file/attachment/save?businessId=" + _this.$objectId + "&bizType=pic&token=" + mapObj.$token,
                    /*这是处理文件上传的servlet*/
                    secureuri: false,
                    fileElementId: picId, //上传input的id
                    dataType: "json",
                    type: "POST",
                    async: false,
                    success: function(data, status) {
                        console.log(data);
                        console.log(data.success);
                        var statu = data.success;
                        if (statu == 1) {
                            nImgHasBeenSendSuccess++;
                            if (nImgHasBeenSendSuccess == files.length) {
                                //上传表单
                                console.log("dd")
                                _this.uploadData();
                            }
                        } else {
                            alert("当前网络不稳定");
                            _this.again();
                        }
                    }
                });
            }
        } else {
            console.log("weism")
                //上传表单
            _this.uploadData();
        }
    },
    uploadData: function() {
        var _this = this;
        var eventData = this.formData();
        console.log(JSON.stringify(eventData));
        $.ajax({
            type: 'POST',
            url: "/cloudlink-inspection-task/dispose/save?token=" + mapObj.$token,
            contentType: "application/json",
            data: JSON.stringify(eventData),
            dataType: "json",
            success: function(data, status) {
                console.log("返回" + JSON.stringify(data));
                if (data.success == 1) {
                    _this.$taskM.modal('hide');
                    window.location.reload();
                } else {
                    alert("当前网络不稳定");
                    _this.again();
                }
            }
        })
    },
    formData: function() {
        var _this = this;
        var createTime = $("#datetime").val();
        var content = $("#event_description").val().trim();
        console.log(_this.$taskId)
        var dataMsg = {
            "objectId": this.$objectId,
            "type": $("input[name='taskType']:checked").val(),
            "content": content,
            "createTime": createTime,
            "taskId": _this.$taskId,
            "receiveUserIds": [{
                "userId": "714849be-15ce-4358-a668-f06f940d1b6f",
                "userName": "谢测试"
            }]
        }
        return dataMsg;
    },
    again: function() {
        this.$flg = true;
    }
};

var searchObj = {
    $items: $('.top .item'), //搜索条件dom
    $searchInput: $('#searchInput'), //搜索关键词dom
    $startDate: $("#datetimeStart"),
    $endDate: $("#datetimeEnd"),
    // tracksIdsArr: [], //存放已被选中的轨迹ID
    defaultObj: { //默认搜索条件
        "status": "20", //20:处理中，21：已完成，:全部
        "startDate": new Date().Format('yyyy-MM-dd'), //开始日期
        "endDate": new Date().Format('yyyy-MM-dd'), //结束日期
        "keyword": "", //高级搜索关键词
        "type": "", //事件类型，逗号分隔的
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    querryObj: { //请求的搜索条件
        "status": "20,21",
        "startDate": new Date().Format('yyyy-MM-dd'), //开始日期
        "endDate": new Date().Format('yyyy-MM-dd'), //结束日期
        "keyword": "", //巡线人，巡线编号
        "type": "",
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    activeObj: { //高亮默认搜索条件，用于渲染页面
        "status": "20",
        "date": "day",
        "typeParent": '0'
    },
    init: function() {
        this.renderActive(); //初始化显示被选中
        this.bindEvent(); //监听事件
        this.bindDateDiyEvent(); //时间控件初始化
    },
    renderActive: function(obj) { //被选中的样式
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
            if (key === 'typeParent') {
                if (obj[key] == '1') {
                    that.renderActive({ "type": "4,5,6,7,8,9,10" });
                    $(".item2_id").eq(obj[key] - 1).show().siblings().hide();
                } else if (obj[key] == '2') {
                    that.renderActive({ "type": "11,12,13,14,15,16,17" });
                    $(".item2_id").eq(obj[key] - 1).show().siblings().hide();
                } else if (obj[key] == '3') {
                    that.renderActive({ "type": "18,19" });
                    $(".item2_id").eq(obj[key] - 1).show().siblings().hide();
                } else {
                    $(".item2_id").hide();
                }
            }
        }
    },
    bindEvent: function() {
        var that = this;
        /* 选择条件 */
        that.$items.click(function() {
            var key = $(this).parent().attr("data-class");
            var value = $(this).attr("data-value");

            if (key === 'date') {
                that.setDate(value);
            } else if (key === 'typeParent') {
                that.setType(value);
            } else {
                that.querryObj[key] = value;
            }

            var obj = {};
            obj[key] = value;
            that.renderActive(obj);
            that.refreshTable();
            console.log(that.querryObj);
        });

        /* 搜索关键词 */
        $('#gf_Btn').click(function() {
            var s = $(this).parent().find('input').val();
            that.querryObj.keyword = s;
            that.refreshTable();
        });
        /* 显示高级搜索 */
        $('#search_more').click(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.more_item_wrapper').slideUp();
            } else {
                $(this).addClass('active');
                $('.more_item_wrapper').slideDown();
            }
        });
        /* 清空搜索条件 */
        $('#gf_reset_Btn').click(function() {
            //请求数据还原到初始话
            Object.assign(that.querryObj, that.defaultObj);
            that.renderActive();
            that.refreshTable();
        });
        /* 导出数据 */
        $('#export_all').click(function() {
            // that.requestOutput(0);
        });
        $('#export_choice').click(function() {
            // that.requestOutput(2);
        });
        //自定义时间
        $('#diyDateBtn').on('click', function() {
            var s = that.$startDate.val();
            var e = that.$endDate.val();
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
    setDate: function(value) {
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
    setType: function(e) {
        var _this = this;
        switch (e) {
            case '0':
                _this.querryObj.type = '';
                break;
            case '1':
                _this.querryObj.type = '4,5,6,7,8,9,10';
                break;
            case '2':
                _this.querryObj.type = '11,12,13,14,15,16,17';
                break;
            case '3':
                _this.querryObj.type = '18,19';
        }
    },
    refreshTable: function() {
        var that = this;
        that.$searchInput.val(that.querryObj.keyword);
        that.querryObj.pageNum = '1';
        $('#task_table').bootstrapTable('refreshOptions', {
            pageNumber: +that.querryObj.pageNum,
            pageSize: +that.querryObj.pageSize,
            queryParams: function(params) {
                that.querryObj.pageSize = params.pageSize;
                that.querryObj.pageNum = params.pageNumber;
                return that.querryObj;
            }
        });
    },
    bindDateDiyEvent: function() { //时间控件
        $('#datetime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            startDate: new Date()
        });
        $("#datetimeStart").datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
            // startDate: new Date()
        }).on("click", function() {
            $("#datetimeStart").datetimepicker("setEndDate", $("#datetimeEnd").val())
        });
        $("#datetimeEnd").datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
            // startDate: new Date()
        }).on("click", function() {
            $("#datetimeEnd").datetimepicker("setStartDate", $("#datetimeStart").val())
        });
    }
}


function initTable() {
    $('#task_table').bootstrapTable({
        url: "/cloudlink-inspection-task/task/getPageList?token=" + mapObj.$token, //请求数据url
        method: 'post',
        // data: "dataAll",
        toolbar: "#toolbar",
        toolbarAlign: "left",
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        // detailView: true, //显示详细信息
        showHeader: true,
        // showColumns: true,  //显示内容下拉框
        showRefresh: true,
        pagination: true, //分页
        sidePagination: 'server', //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 20, 50], //分页步进值
        search: false, //显示搜索框
        searchOnEnterKey: false,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        queryParams: function(params) {
            return {
                // offset: params.offset, //页码
                // limit: params.limit, //页面大小
                // search: params.search, //搜索
                // order: params.order, //排序
                // ordername: params.sort, //排序
                pageSize: params.pageSize,
                pageNum: params.pageNumber,
                // searchText: params.searchText,
                // sortName: params.sortName,
                // sortOrder: params.sortOrder,
                type: "",
                startDate: new Date().Format('yyyy-MM-dd'),
                endDate: new Date().Format('yyyy-MM-dd'),
                status: "20"
            };
        },
        responseHandler: function(res) {
            return res;
        },
        onLoadSuccess: function(data) {
            // alert(JSON.stringify(data));
            var dataAll = data.rows; //初始化的数据
            if (dataAll.length == 0) {} else {
                mapObj.addMark(dataAll);
            }
        },
        //表格的列
        columns: [{
            field: 'state', //域值
            checkbox: true, //复选框
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '4%',
        }, {
            field: 'stakeholder', //域值
            title: '待办', //标题
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '4%',
            cellStyle: function(value, row, index) {
                return {
                    css: {
                        "color": "red",
                    }
                };
            },
            formatter: function(value, row, index) {
                if (value == 1) {
                    return "待办";
                } else {
                    return "";
                }
            }
        }, {
            field: 'taskCode', //域值
            title: '任务编号', //标题
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '14%',
        }, {
            field: 'taskStatusDesc', //域值
            title: '任务状态', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '7%',
            editable: true,
            cellStyle: function(value, row, index) {
                return {
                    css: {
                        "max-width": "300px",
                        "word-wrap": "break-word",
                        "word-break": "normal"
                    }
                };
            }
        }, {
            field: 'fullTypeName', //域值
            title: '事件类型', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '15%',
            editable: true,
        }, {
            field: 'disposeTypeName', //域值
            title: '最新处置类型', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '8%',
            // editable: true,
        }, {
            field: 'disposeCreateTime', //域值
            title: '最新处置时间', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '15%',
            editable: true, //可编辑
        }, {
            field: 'taskCreateUserName', //域值
            title: '任务发起人', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '8%',
            editable: false, //可编辑
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            events: operateEvents,
            width: '15%',
            formatter: operateFormatter
        }]
    });
}

function operateFormatter(value, row, index) {
    var managementClass = null;
    var closedClass = null
    if (row.stakeholder == 1) {
        if (row.taskStatus == 20) {
            managementClass = 'management';
            closedClass = 'closed';
        } else {
            managementClass = 'management_end';
            closedClass = 'closed_end';
        }
    } else {
        managementClass = 'management_end';
        closedClass = 'closed_end';
    }
    return [
        '<a class="location" href="javascript:void(0)" title="定位">',
        '<i></i>',
        '</a>&nbsp;&nbsp;&nbsp;&nbsp;',
        '<a class="' + managementClass + '" href="javascript:void(0)" title="处置">',
        '<i></i>',
        '</a>&nbsp;&nbsp;&nbsp;&nbsp;',
        '<a class="check" data-toggle="modal" href="javascript:void(0)" title="查看">',
        '<i></i>',
        '</a>&nbsp;&nbsp;&nbsp;&nbsp;',
        '<a class="' + closedClass + '" href="javascript:void(0)" title="关闭">',
        '<i></i>',
        '</a>',
    ].join('');


}
// 表格里面的操作
window.operateEvents = {
    //定位功能
    'click .location': function(e, value, row, index) {
        if ($(this).find('i').attr("class") == 'active') {} else {
            $(".location").find('i').attr("class", "");
            $(this).find('i').attr("class", "active");
            mapObj.getMark(row);
        }
        $('body,html').animate({ scrollTop: 0 }, 500);
        return false;
    },
    //查看详情
    'click .check': function(e, value, row, index) {
        if ($(this).find('i').attr("class") == 'active') {} else {
            $(".check").find('i').attr("class", "");
            $(this).find('i').attr("class", "active");
        }
        console.log(row);

        $("#details").modal(); //打开详情模态框
        // setTimeout('taskDetailsObj.init(row)', 1000);
        taskDetailsObj.loadDetails(row)
            /*
            var eventId = row.eventId;
            var taskId = row.taskId;
            // console.log();
            var lon = row.bdLon;
            var lat = row.bdLat;
            $("#details").modal(); //打开详情模态框
            $(".taskCode").text(row.taskCode);
            //获取事件详情
            $.ajax({
                type: 'GET',
                url: "/cloudlink-inspection-event/eventInfo/get?eventId=" + eventId,
                contentType: "application/json",
                dataType: "json",
                success: function(data, status) {
                    var detailsMap = new BMap.Map("details_address_map");
                    detailsMap.reset();
                    detailsMap.enableScrollWheelZoom(true);
                    var point = new BMap.Point(lon, lat);
                    detailsMap.centerAndZoom(point, 15);
                    var myIcon = new BMap.Icon("/src/images/event/personal.png", new BMap.Size(130, 130));
                    var marker = new BMap.Marker(point, {
                        icon: myIcon
                    });
                    detailsMap.clearOverlays();
                    detailsMap.addOverlay(marker);
                    mapObj.iconHide(); //隐藏百度图标

                    var msg = data.rows;
                    var images = msg[0].pic;
                    $(".event_pic").html("");
                    $(".eventCode").text(msg[0].eventCode);
                    $(".occurrenceTime").text(msg[0].occurrenceTime);
                    $(".fullTypeName").text(msg[0].fullTypeName);
                    $(".inspectorName").text(msg[0].inspectorName);
                    $(".address").text(msg[0].address);
                    $(".description").text(msg[0].description);
                    //$(".event_audio").attr("src", '/cloudlink-core-file/file/downLoad?fileId=' + msg[0].audio[0] + "&audioFileName" + 0.1 + ".amr");

                    var pic_scr = "";
                    for (var i = 0; i < images.length; i++) {
                        pic_scr += '<div class="event_pic_list">' +
                            '<img  src="/cloudlink-core-file/file/getImageBySize?fileId=' + images[i] + '&viewModel=fill&width=104&hight=78" id="imagesPic' + i + '" onclick="previewPicture(this)" alt=""/>' +
                            '</div>';
                    }
                    $(".event_pic").append(pic_scr);
                    $.ajax({
                        type: 'GET',
                        url: "/cloudlink-core-file/file/getUrlByFileId?fileId=" + msg[0].audio[0],
                        contentType: "application/json",
                        dataType: "json",
                        success: function(data, status) {
                            // console.log(data.rows[0].fileUrl);
                            $(".event_audio").attr("src", '' + data.rows[0].fileUrl);
                        }
                    })
                }
            });
            //获取处置信息
            $.ajax({
                type: 'GET',
                url: "/cloudlink-inspection-task/dispose/getPageListByTaskId?taskId=" + taskId,
                contentType: "application/json",
                dataType: "json",
                success: function(data, status) {
                    var msgAll = data.rows;
                    $(".dispose_content").html("");
                    var txt = '';

                    var tempArry = [];
                    var temp = "";

                    for (var i = 0; i < msgAll.length; i++) {
                        if (temp != msgAll[i].modifyday) {
                            tempArry.push(msgAll[i].modifyday);
                            temp = msgAll[i].modifyday;
                        }
                    }
                    for (var j = 0; j < tempArry.length; j++) {
                        txt = '<div class="dispose_date" id="day_' + j + '">' +
                            '<div class="dispose_day">' +
                            '<div class="day_dian"></div>' +
                            '<div class="day_time">' + tempArry[j] + '</div>' +
                            '</div></div>';
                        $(".dispose_content").append(txt);

                        for (var x = 0; x < msgAll.length; x++) {
                            var txtChild = '';
                            if (msgAll[x].modifyday == tempArry[j]) {
                                var recevieUser = msgAll[x].recevieUserName;
                                if (recevieUser == null || recevieUser == '') {
                                    recevieUser = '无';
                                }
                                txtChild = '<div class="dispose_main">' +
                                    '<div class="dispose_main_l">' +
                                    '<span class="dispose_time">' + msgAll[x].modifytime + '</span>' +
                                    '</div>' +
                                    '<div class="dispose_main_r">' +
                                    '<div class="dispose_info">' +
                                    '<span class="modifyUserName">' + msgAll[x].modifyUserName + '</span>&nbsp&nbsp' +
                                    '<span class="disposeValue">' + msgAll[x].disposeValue + '</span>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">信息描述：</span>' +
                                    '<div class="info_r">' + msgAll[x].content + '</div>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">语音描述：</span>' +
                                    '<div class="info_r">' + msgAll[x].audio[0] + '</div>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">接收人：</span>' +
                                    '<div class="info_r">' + recevieUser + '</div>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">照片：</span>' +
                                    '<div class="info_r taskImg_' + x + '"></div>' +
                                    '</div></div></div>';
                                $("#day_" + j).append(txtChild);

                                var picAll = msgAll[x].pic;
                                var pic_scr = "";
                                for (var n = 0; n < picAll.length; n++) {
                                    pic_scr += '<div class="task_pic_list">' +
                                        '<img  src="/cloudlink-core-file/file/getImageBySize?fileId=' + picAll[n] + '&viewModel=fill&width=104&hight=78" id="taskImagesPic' + n + '" onclick="previewPicture(this)" alt=""/>' +
                                        '</div>';
                                }
                                $(".taskImg_" + x).append(pic_scr);
                            }
                        }
                    }
                }
            })
            */
        return false;
    },
    //填写处置信息
    'click .management': function(e, value, row, index) {
        if ($(this).find('i').attr("class") == 'active') {} else {
            $(".management").find('i').attr("class", "");
            $(this).find('i').attr("class", "active");
        }
        taskObj.eventOpen(row);
        return false;
    },
    //关闭任务
    'click .closed': function(e, value, row, index) {

        $(".closed").find('i').attr("class", "");
        $(this).find('i').attr("class", "active");
        taskObj.$taskId = row.taskId;
        return false;
    }
};


var taskDetailsObj = {
        $detailsMap: new BMap.Map("details_address_map"),
        $disposeTask: $(".disposeTask"),
        $closeTask: $(".closeTask"),
        _taskId: null,
        init: function() {
            var _this = this;
            //this.$detailsMap = new BMap.Map("details_address_map");
            // this.$detailsMap.reset();
            this.$detailsMap.centerAndZoom(new BMap.Point(116.404, 39.915), 5); // 初始化地图,设置中心点坐标和地图级别
            this.$detailsMap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            //声明-比例尺控件（左下角）
            var bottom_left_ScaleControl = new BMap.ScaleControl({
                anchor: BMAP_ANCHOR_BOTTOM_LEFT
            });
            //声明-平移和缩放按钮控件（右下角）
            var bottom_right_navigation = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_SMALL
            });
            //地图加载控件
            this.$detailsMap.addControl(bottom_left_ScaleControl);
            this.$detailsMap.addControl(bottom_right_navigation);
            this.$detailsMap.addControl(new BMap.MapTypeControl());

            // this.loadDetails(_row);

            this.$closeTask.click(function() {
                console.log(_this._taskId);
                console.log(_this.closedWhether(_this._taskId))
                if (_this.closedWhether(_this._taskId) == true) {
                    console.log("dd");
                    _this.closedWhether(_this._taskId)
                } else {
                    console.log("cc");
                }
            })

        },
        loadDetails: function(row) {
            $(".taskCode").text(row.taskCode);
            var eventId = row.eventId;
            this._taskId = row.taskId;
            console.log(row);
            var lon = row.bdLon;
            var lat = row.bdLat;
            this.setCenterZoom(lon, lat);
            this.loadEventDetails(eventId);
            this.loadTaskDetails(this._taskId);
        },
        setCenterZoom: function(lon, lat) {
            console.log("1")
            this.$detailsMap.clearOverlays();
            var point = new BMap.Point(lon, lat);
            var myIcon = new BMap.Icon("/src/images/event/personal.png", new BMap.Size(130, 130));
            var marker = new BMap.Marker(point, {
                icon: myIcon
            });

            this.$detailsMap.addOverlay(marker);
            this.$detailsMap.centerAndZoom(point, 15);
            mapObj.iconHide(); //隐藏百度图标
        },
        loadEventDetails: function(eventId) {
            console.log("2")
            $.ajax({
                type: 'GET',
                url: "/cloudlink-inspection-event/eventInfo/get?eventId=" + eventId,
                contentType: "application/json",
                dataType: "json",
                success: function(data, status) {
                    var msg = data.rows;
                    var images = msg[0].pic;
                    $(".event_pic").html("");
                    $(".eventCode").text(msg[0].eventCode);
                    $(".occurrenceTime").text(msg[0].occurrenceTime);
                    $(".fullTypeName").text(msg[0].fullTypeName);
                    $(".inspectorName").text(msg[0].inspectorName);
                    $(".address").text(msg[0].address);
                    $(".description").text(msg[0].description);
                    //$(".event_audio").attr("src", '/cloudlink-core-file/file/downLoad?fileId=' + msg[0].audio[0] + "&audioFileName" + 0.1 + ".amr");

                    var pic_scr = "";
                    for (var i = 0; i < images.length; i++) {
                        pic_scr += '<div class="event_pic_list">' +
                            '<img  src="/cloudlink-core-file/file/getImageBySize?fileId=' + images[i] + '&viewModel=fill&width=104&hight=78" id="imagesPic' + i + '" onclick="previewPicture(this)" alt=""/>' +
                            '</div>';
                    }
                    $(".event_pic").append(pic_scr);
                    $.ajax({
                        type: 'GET',
                        url: "/cloudlink-core-file/file/getUrlByFileId?fileId=" + msg[0].audio[0],
                        contentType: "application/json",
                        dataType: "json",
                        success: function(data, status) {
                            // console.log(data.rows[0].fileUrl);
                            $(".event_audio").attr("src", '' + data.rows[0].fileUrl);
                        }
                    })
                }
            });
        },
        loadTaskDetails: function(taskId) {
            console.log("3")
                //获取处置信息
            $.ajax({
                type: 'GET',
                url: "/cloudlink-inspection-task/dispose/getPageListByTaskId?taskId=" + taskId,
                contentType: "application/json",
                dataType: "json",
                success: function(data, status) {
                    var msgAll = data.rows;
                    $(".dispose_content").html("");
                    var txt = '';

                    var tempArry = [];
                    var temp = "";

                    for (var i = 0; i < msgAll.length; i++) {
                        if (temp != msgAll[i].modifyday) {
                            tempArry.push(msgAll[i].modifyday);
                            temp = msgAll[i].modifyday;
                        }
                    }
                    for (var j = 0; j < tempArry.length; j++) {
                        txt = '<div class="dispose_date" id="day_' + j + '">' +
                            '<div class="dispose_day">' +
                            '<div class="day_dian"></div>' +
                            '<div class="day_time">' + tempArry[j] + '</div>' +
                            '</div></div>';
                        $(".dispose_content").append(txt);

                        for (var x = 0; x < msgAll.length; x++) {
                            var txtChild = '';
                            if (msgAll[x].modifyday == tempArry[j]) {
                                var recevieUser = msgAll[x].recevieUserName;
                                //判断接收人
                                if (recevieUser == null || recevieUser == '') {
                                    recevieUser = '无';
                                }
                                txtChild = '<div class="dispose_main">' +
                                    '<div class="dispose_main_l">' +
                                    '<span class="dispose_time">' + msgAll[x].modifytime + '</span>' +
                                    '</div>' +
                                    '<div class="dispose_main_r">' +
                                    '<div class="dispose_info">' +
                                    '<span class="modifyUserName">' + msgAll[x].modifyUserName + '</span>&nbsp&nbsp' +
                                    '<span class="disposeValue">' + msgAll[x].disposeValue + '</span>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">信息描述：</span>' +
                                    '<div class="info_r">' + msgAll[x].content + '</div>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">语音描述：</span>' +
                                    '<div class="info_r">' + msgAll[x].audio[0] + '</div>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">接收人：</span>' +
                                    '<div class="info_r">' + recevieUser + '</div>' +
                                    '</div>' +
                                    '<div class="dispose_info">' +
                                    '<span class="info_l text-right">照片：</span>' +
                                    '<div class="info_r taskImg_' + x + '"></div>' +
                                    '</div></div></div>';
                                $("#day_" + j).append(txtChild);

                                var picAll = msgAll[x].pic;
                                var pic_scr = "";
                                for (var n = 0; n < picAll.length; n++) {
                                    pic_scr += '<div class="task_pic_list">' +
                                        '<img  src="/cloudlink-core-file/file/getImageBySize?fileId=' + picAll[n] + '&viewModel=fill&width=104&hight=78" id="taskImagesPic' + n + '" onclick="previewPicture(this)" alt=""/>' +
                                        '</div>';
                                }
                                $(".taskImg_" + x).append(pic_scr);
                            }
                        }
                    }
                }
            })
        },
        closedWhether: function(taskId) {
            $.ajax({
                type: 'GET',
                url: "/cloudlink-inspection-task/task/getTaskStatus?taskId=" + taskId,
                contentType: "application/json",
                dataType: "json",
                success: function(data, status) {
                    if (data.success == 1) {
                        var taskState = data.rows;
                        if (taskState[0].status == 21) {
                            alert("您好，该任务已经关闭！");
                            window.location.reload();
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            })
        },
        closedTask: function(taskId) {
            var taskIds = [];
            taskIds.push(taskId);
            $.ajax({
                type: 'POST',
                url: "/cloudlink-inspection-task/task/close",
                contentType: "application/json",
                data: taskIds,
                dataType: "json",
                success: function(data, status) {
                    if (data.success == 1) {
                        alert("任务关闭成功！");
                        window.location.reload();
                    }
                }
            })
        }
    }
    //导出文件
var exportFileObj = {
    $exportAll: $(".export_all"),
    $exportChoice: $(".export_choice"),
    init: function() {


        var bb = {
            "status": "20", //处理状态，括号内为注释
            "type": "1,2,3,4", //事件类型,
            "startDate": "", //开始日期
            "endDate": "", //结束日期
            "keyword": ""
        }

        this.$exportAll.click(function() {

        });
        this.$exportAll.click(function() {

        });
    },
    expoerData: function(date) {
        var options = {
            "url": '/cloudlink-inspection-event/taskInfo/exportExcel?token=' + mapObj.$token,
            "data": date,
            "method": 'post'
        }
        DownLoadFile(options);
    },
    DownLoadFile: function(options) {
        var config = $.extend(true, { method: 'post' }, options);
        var $iframe = $('<iframe id="down-file-iframe" />');
        var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
        $form.attr('action', config.url);
        for (var key in config.data) {
            $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
        }
        $iframe.append($form);
        $(document.body).append($iframe);
        $form[0].submit();
        $iframe.remove();
    }
}