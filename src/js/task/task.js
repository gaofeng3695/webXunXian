$(function() {
    mapObj.init();
    // taskObj.init(); //填写处置信息
    initTable();
    searchObj.init(); //搜索条件

    taskDetailsObj.init(); //任务详情

    tableOperationObj.init(); //表格上面的操作按钮
    drafting('task_map', 'drafting_down'); //启动拖拽

});

// 地图的显示隐藏

var mapObj = {
    $user: JSON.parse(lsObj.getLocalStorage("userBo")),
    $mapBtn: $(".bottom_btn span"),
    $mapO: $("#task_map"), //百度地图DIV容器
    $bdMap: new BMap.Map("task_map"), //创建百度地图实例
    $zoom: ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"],
    aCurrentPoints: [],
    init: function() { //地图初始化方法
        var _this = this;
        this.$bdMap.centerAndZoom(new BMap.Point(116.404, 39.915), 5); // 初始化地图,设置中心点坐标和地图级别
        this.$bdMap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
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
        this.$bdMap.addControl(bottom_left_ScaleControl);
        this.$bdMap.addControl(bottom_right_navigation);
        this.$bdMap.addControl(new BMap.MapTypeControl());

        //地图的展开和收缩-点击事件
        $(".bottom_btn span").click(function() {
            _this.mapSwitch();
        });
    },
    mapSwitch: function() { //地图展开、收缩的开关
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
    //地图打点并计算中心点及缩放等级
    setPointsMarkerWithCenterPointAndZoomLevel: function(data) {
        this.$bdMap.clearOverlays(); //清除地图上已经标注的点
        //var maxPointAndMinPointObj = this.getMaxPointAndMinPoint(data); //计算当前数据中 最大的经纬度 及 最小的经纬度
        // xxwsWindowObj.xxwsAlert(JSON.stringify(maxPointAndMinPointObj));
        //var centerPointAndZoomLevel = this.getCenterPointAndZoomLevel(maxPointAndMinPointObj.maxLon, maxPointAndMinPointObj.maxLat, maxPointAndMinPointObj.minLon, maxPointAndMinPointObj.minLat);
        //this.$bdMap.centerAndZoom(centerPointAndZoomLevel.centerPoint, centerPointAndZoomLevel.zoomlevel); //设置中心点

        //计算中心点及缩放的新方法
        var arr = data.map(function(item, index, arr) {
            return new BMap.Point(item.bdLon, item.bdLat);
        });
        this.$bdMap.setViewport(arr, {
            zoomFactor: -1
        });

        this.setPointsMarker(data);
    },
    //地图打点(多个点)
    setPointsMarker: function(data) {
        //this.$bdMap.clearOverlays(); //清除地图上已经标注的点
        var txts = null;
        var myIcons = null;
        var markers = null;
        var point = null;
        this.aCurrentPoints = [];
        for (var i = 0; i < data.length; i++) {
            txts = '<div><p>事件类型：' + data[i].fullTypeName + '</p>' +
                '<p>事件状态：' + data[i].taskStatusDesc + '</p>' +
                '<p>上报人：' + data[i].taskCreateUserName + '</p></div>';

            point = new BMap.Point(data[i].bdLon, data[i].bdLat);
            if (data[i].parentTypeId == 1) {
                if (data[i].taskStatus == 20) {
                    myIcons = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
                } else {
                    myIcons = new BMap.Icon("/src/images/event/con2.png", new BMap.Size(29, 42));
                }
            } else if (data[i].parentTypeId == 2) {
                if (data[i].taskStatus == 20) {
                    myIcons = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
                } else {
                    myIcons = new BMap.Icon("/src/images/event/dis2.png", new BMap.Size(29, 42));
                }
            } else if (data[i].parentTypeId == 3) {
                if (data[i].taskStatus == 20) {
                    myIcons = new BMap.Icon("/src/images/event/pip1.png", new BMap.Size(29, 42));
                } else {
                    myIcons = new BMap.Icon("/src/images/event/pip2.png", new BMap.Size(29, 42));
                }
            }
            markers = new BMap.Marker(point, {
                icon: myIcons
            });
            this.$bdMap.addOverlay(markers);
            //将当前地图上的坐标点 赋值全局变量
            this.aCurrentPoints.push({
                'key': data[i].taskId,
                'value': markers
            });
            this.addClickHandler(txts, markers);
        }
    },
    ///获取max坐标和min坐标
    getMaxPointAndMinPoint: function(_data) {
        var _maxLon = 0,
            _maxLat = 0,
            _minLon = 999,
            _minLat = 999;
        var _length = _data.length;
        for (var i = 0; i < _length; i++) {

            if (_maxLon < _data[i].bdLon) {
                _maxLon = _data[i].bdLon;
            }
            if (_minLon > _data[i].bdLon) {
                _minLon = _data[i].bdLon;
            }
            if (_maxLat < _data[i].bdLat) {
                _maxLat = _data[i].bdLat;
            }
            if (_minLat > _data[i].bdLat) {
                _minLat = _data[i].bdLat;
            }
        }
        var _obj = {
            maxLon: _maxLon,
            maxLat: _maxLat,
            minLon: _minLon,
            minLat: _minLat
        };
        return _obj;　　　　
    },
    //获取中心点及zoom级别
    getCenterPointAndZoomLevel: function(maxLon, maxLat, minLon, minLat) {
        var pointA = new BMap.Point(maxLon, maxLat); // 创建点坐标A  
        var pointB = new BMap.Point(minLon, minLat); // 创建点坐标B  
        var distance = this.$bdMap.getDistance(pointA, pointB).toFixed(1); //获取两点距离,保留小数点后两位
        //xxwsWindowObj.xxwsAlert(distance);
        var _obj = {
            zoomlevel: 0,
            centerPoint: null
        }; //返回的对象
        for (var i = 0, zoomLen = this.$zoom.length; i < zoomLen; i++) {
            if (this.$zoom[i] - distance > 0) {
                _obj.zoomlevel = (18 - i + 3); //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3
                break;
            }
        };
        var _centerpoint = new BMap.Point((maxLon + minLon) / 2, (maxLat + minLat) / 2);
        _obj.centerPoint = _centerpoint;
        return _obj;
    },
    singlePointLocation: function(selectedItem) {
        var isExist = 0;
        this.$bdMap.centerAndZoom(new BMap.Point(selectedItem.bdLon, selectedItem.bdLat), 18); //中心点跳转

        for (var i = 0; i < this.aCurrentPoints.length; i++) {
            if (this.aCurrentPoints[i].key == selectedItem.taskId) {
                isExist++;
                this.aCurrentPoints[i].value.setAnimation(BMAP_ANIMATION_BOUNCE);

            } else {
                this.aCurrentPoints[i].value.setAnimation();
            }
        }
        if (isExist > 0) return;
        var _point = new BMap.Point(selectedItem.bdLon, selectedItem.bdLat);
        var _marker = new BMap.Marker(_point); // 创建标注

        var txts = null;
        var myIcons = null;
        txts = '<div><p>事件类型：' + selectedItem.fullTypeName + '</p>' +
            '<p>事件状态：' + selectedItem.taskStatusDesc + '</p>' +
            '<p>上报人：' + selectedItem.taskCreateUserName + '</p></div>';

        if (selectedItem.parentTypeId == 1) {
            if (selectedItem.taskStatus == 20) {
                myIcons = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
            } else {
                myIcons = new BMap.Icon("/src/images/event/con2.png", new BMap.Size(29, 42));
            }
        } else if (selectedItem.parentTypeId == 2) {
            if (selectedItem.taskStatus == 20) {
                myIcons = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
            } else {
                myIcons = new BMap.Icon("/src/images/event/dis2.png", new BMap.Size(29, 42));
            }
        } else if (selectedItem.parentTypeId == 3) {
            if (selectedItem.taskStatus == 20) {
                myIcons = new BMap.Icon("/src/images/event/pip1.png", new BMap.Size(29, 42));
            } else {
                myIcons = new BMap.Icon("/src/images/event/pip2.png", new BMap.Size(29, 42));
            }
        }
        _marker = new BMap.Marker(_point, {
            icon: myIcons
        });

        this.$bdMap.addOverlay(_marker); // 将标注添加到地图中 
        _marker.setAnimation(BMAP_ANIMATION_BOUNCE);
        this.aCurrentPoints.push({
            key: selectedItem.taskId,
            value: _marker
        });
        this.addClickHandler(txts, _marker);
    },
    addClickHandler: function(content, marker) {
        var _this = this;
        marker.addEventListener("click", function(e) {
            // xxwsWindowObj.xxwsAlert(content);
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
        mapObj.$bdMap.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    iconHide: function() { //隐藏百度图标与文字
        $(".BMap_cpyCtrl.BMap_noprint.anchorBL,.anchorBL").hide();
        $(".anchorBL a").hide();
    }
};

//高级搜索相关的对象与方法
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
        "status": "20",
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
                    that.renderActive({
                        "type": "4,5,6,7,8,9,10"
                    });
                    $(".item2_id").eq(obj[key] - 1).show().siblings().hide();
                } else if (obj[key] == '2') {
                    that.renderActive({
                        "type": "11,12,13,14,15,16,17"
                    });
                    $(".item2_id").eq(obj[key] - 1).show().siblings().hide();
                } else if (obj[key] == '3') {
                    that.renderActive({
                        "type": "18,19"
                    });
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
            // console.log(that.querryObj);
        });

        /* 搜索关键词 */
        $('#gf_Btn').click(function() {
            var s = $(this).parent().find('input').val();
            that.querryObj.keyword = s;
            that.refreshTable();
        });
        /* keyup事件 */
        that.$searchInput.keypress(function(e) {
            if (e && e.keyCode === 13) { // enter 键
                //that.querryObj.keyword = that.$searchInput.val();
                that.refreshTable();
            }
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
            $.extend(that.querryObj, that.defaultObj);
            // Object.assign(that.querryObj, that.defaultObj);

            that.$startDate.val("");
            that.$endDate.val("");
            that.$searchInput.val("");
            $("#diyDateBtn").removeClass("active");
            that.renderActive();
            that.refreshTable();
        });
        //自定义时间
        $('#diyDateBtn').on('click', function() {
            var s = that.$startDate.val();
            var e = that.$endDate.val();
            if (!s) {
                xxwsWindowObj.xxwsAlert('请选择开始时间');
                return;
            }
            if (!e) {
                xxwsWindowObj.xxwsAlert('请选择结束时间');
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
        // console.log(that.querryObj);
        that.querryObj.keyword = that.$searchInput.val().trim();
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
        url: "/cloudlink-inspection-task/task/getPageList?token=" + lsObj.getLocalStorage('token'), //请求数据url
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
        striped: true,
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
            // console.log(data);
            if (data.rows.length > 0) {
                mapObj.setPointsMarkerWithCenterPointAndZoomLevel(data.rows);
            } else {
                mapObj.$bdMap.clearOverlays();
            }
        },
        //表格的列
        columns: [{
            field: 'state', //域值
            checkbox: true, //复选框
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '3%',
        }, {
            field: 'stakeholder', //域值
            title: '待办', //标题
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '6%',
            formatter: function(value, row, index) {
                if (value == 1) {
                    return "<span class='dealtTask'>待办</span>";
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
            width: '11%',
            // editable: true,
        }, {
            field: 'disposeCreateTime', //域值
            title: '最新处置时间', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '13%',
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
            width: '13%',
            formatter: operateFormatter
        }]
    });
}

//判断时间选择是否有值
function dateChangeForSearch() {
    var startDate = $("#datetimeStart").val();
    var endDate = $("#datetimeEnd").val();
    if (startDate != "" && endDate !== "") {
        $("#diyDateBtn").addClass("active");
    } else {
        $("#diyDateBtn").removeClass("active");
    }
}

//操作按钮的展现
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
            mapObj.singlePointLocation(row);
        }
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    },
    //查看详情
    'click .check': function(e, value, row, index) {
        // console.log(row)
        $("#details").modal(); //打开详情模态框

        if (row.stakeholder == 0) {
            $(".disposeTask").hide();
            $(".closeTask").hide();
        } else {
            $(".disposeTask").show();
            $(".closeTask").show();
        }
        $('#details').on('shown.bs.modal', function(e) {
            // console.log(row)
            taskDetailsObj.loadDetails(row);
        });
        // setTimeout(function() {
        //     taskDetailsObj.loadDetails(row);
        // }, 1000);

        return false;
    },
    //填写处置信息
    'click .management': function(e, value, row, index) {
        taskObj.taskOpen(row.taskId);
        return false;
    },
    //关闭任务
    'click .closed': function(e, value, row, index) {
        var defaultOptions = {
            tip: '您是否关闭该任务？',
            name_title: '提示',
            name_cancel: '取消',
            name_confirm: '确定',
            isCancelBtnShow: true,
            callBack: function() {
                taskDetailsObj.closedWhether(row.taskId);
            }
        };
        xxwsWindowObj.xxwsAlert(defaultOptions);
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

        //关闭任务按钮
        this.$closeTask.click(function() {
            var defaultOptions = {
                tip: '您是否关闭该任务？',
                name_title: '提示',
                name_cancel: '取消',
                name_confirm: '确定',
                isCancelBtnShow: true,
                callBack: function() {
                    _this.closedWhether(_this._taskId);
                }
            };
            xxwsWindowObj.xxwsAlert(defaultOptions);

        });
        //填写处置信息按钮
        this.$disposeTask.click(function() {
            $("#details").modal('hide'); //关闭详情模态框
            taskObj.taskOpen(_this._taskId);
        });

    },
    loadDetails: function(row) {
        $(".taskCode").text(row.taskCode);
        var eventId = row.eventId;
        this._taskId = row.taskId;
        // console.log(row);
        var lon = row.bdLon;
        var lat = row.bdLat;
        this.loadEventDetails(eventId);
        this.loadTaskDetails(this._taskId);
    },
    setCenterZoom: function(msg) {
        // debugger;
        var _this = this;
        var lon = msg[0].bdLon;
        var lat = msg[0].bdLat;
        this.$detailsMap.clearOverlays();
        var point = new BMap.Point(lon, lat);
        var myIcon = null;
        if (msg[0].parentTypeId == 1) {
            if (msg[0].status == 20) {
                myIcon = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
            } else {
                myIcon = new BMap.Icon("/src/images/event/con2.png", new BMap.Size(29, 42));
            }
        } else if (msg[0].parentTypeId == 2) {
            if (msg[0].status == 20) {
                myIcon = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
            } else {
                myIcon = new BMap.Icon("/src/images/event/dis2.png", new BMap.Size(29, 42));
            }
        } else if (msg[0].parentTypeId == 3) {
            if (msg[0].status == 20) {
                myIcon = new BMap.Icon("/src/images/event/pip1.png", new BMap.Size(29, 42));
            } else {
                myIcon = new BMap.Icon("/src/images/event/pip2.png", new BMap.Size(29, 42));
            }
        }
        // var myIcon = new BMap.Icon("/src/images/event/personal.png", new BMap.Size(130, 130));
        var marker = new BMap.Marker(point, {
            icon: myIcon
        });

        this.$detailsMap.addOverlay(marker);
        this.$detailsMap.centerAndZoom(point, 15);
        mapObj.iconHide(); //隐藏百度图标
    },
    loadEventDetails: function(eventId) {
        var _this = this;
        $.ajax({
            type: 'GET',
            url: "/cloudlink-inspection-event/eventInfo/get?eventId=" + eventId,
            contentType: "application/json",
            dataType: "json",
            success: function(data, status) {
                var msg = data.rows;
                var images = msg[0].pic;
                $(".event_pic ul").html("");
                $(".eventCode").text(msg[0].eventCode);
                $(".occurrenceTime").text(msg[0].occurrenceTime);
                $(".fullTypeName").text(msg[0].fullTypeName);
                $(".inspectorName").text(msg[0].inspectorName);
                $(".address").text(msg[0].address);
                $(".description").text(msg[0].description);

                if (msg[0].audio.length == 0) {
                    $(".event_audio").html("无");
                } else {
                    var audioMain = '<button class="audioPlay" onclick="playAmrAudio(\'' + msg[0].audio[0] + '\',this)"></button>';
                    $(".event_audio").html(audioMain);
                }

                var pic_scr = "";
                for (var i = 0; i < images.length; i++) {
                    pic_scr += '<li class="event_pic_list">' +
                        '<img  src="/cloudlink-core-file/file/getImageBySize?fileId=' + images[i] + '&viewModel=fill&width=104&hight=78" data-original="/cloudlink-core-file/file/downLoad?fileId=' + images[i] + '" id="imagesPic' + i + '" onclick="previewPicture(this)" alt=""/>' +
                        '</li>';
                }
                $(".event_pic ul").append(pic_scr);

                //打开地图中心点
                _this.setCenterZoom(msg);
                $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                    if (e.target.innerHTML == "事件详情") {
                        _this.setCenterZoom(msg);
                    }
                });

            }
        });
    },
    loadTaskDetails: function(taskId) {
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
                                '<div class="info_r task_audio_' + x + '"></div>' +
                                '</div>' +
                                '<div class="dispose_info">' +
                                '<span class="info_l text-right">接收人：</span>' +
                                '<div class="info_r">' + recevieUser + '</div>' +
                                '</div>' +
                                '<div class="dispose_info">' +
                                '<span class="info_l text-right">照片：</span>' +
                                '<div class="info_r"><ul class="taskImg_' + x + '"></ul></div>' +
                                '</div></div></div>';
                            $("#day_" + j).append(txtChild);
                            //添加录音文件
                            if (msgAll[x].audio.length == 0) {
                                $(".task_audio_" + x).html("无");
                            } else {
                                var audioMain = '<button  class="audioPlay" onclick="playAmrAudio(\'' + msgAll[x].audio[0] + '\',this)"></button>';
                                $(".task_audio_" + x).html(audioMain);
                            }
                            var picAll = msgAll[x].pic;
                            var pic_scr = "";
                            for (var n = 0; n < picAll.length; n++) {
                                pic_scr += '<li class="task_pic_list">' +
                                    '<img data-original="/cloudlink-core-file/file/downLoad?fileId=' + picAll[n] + '" src="/cloudlink-core-file/file/getImageBySize?fileId=' + picAll[n] + '&viewModel=fill&width=104&hight=78" id="taskImagesPic' + n + '" onclick="previewPicture(this)" alt=""/>' +
                                    '</li>';
                            }
                            $(".taskImg_" + x).append(pic_scr);
                        }
                    }
                }
            }
        })
    },
    closedWhether: function(taskId) {
        var _this = this;
        $.ajax({
            type: 'GET',
            url: "/cloudlink-inspection-task/task/getTaskStatus?taskId=" + taskId,
            contentType: "application/json",
            dataType: "json",
            success: function(data, status) {
                console.log(data);
                if (data.success == 1) {
                    var taskState = data.rows;
                    if (taskState[0].status == 21) {
                        xxwsWindowObj.xxwsAlert("您好，该任务已经关闭！");
                        window.location.reload();
                        return false;
                    } else {
                        _this.closedTask(taskId);
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
            url: "/cloudlink-inspection-task/task/close?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(taskIds),
            dataType: "json",
            success: function(data, status) {
                if (data.success == 1) {
                    xxwsWindowObj.xxwsAlert("任务关闭成功！");
                    window.location.reload();
                }
            }
        })
    }
};
//查看大图
function previewPicture(e) {
    viewPicObj.viewPic(e);
};

//录音文件的播放
function playAmrAudio(_fileId, e) {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        xxwsWindowObj.xxwsAlert("IE浏览器暂不支持录音文件的播放，建议使用Chrome、Firefox等浏览器！");
        return true;
    } else {
        $.ajax({
            type: 'GET',
            url: "/cloudlink-core-file/file/getUrlByFileId?fileId=" + _fileId,
            contentType: "application/json",
            dataType: "json",
            success: function(data, status) {
                var relativePath = data.rows[0].fileUrl.replace(/^.*?\:\/\/[^\/]+/, "");
                fetchBlob('/audio' + relativePath, function(blob) {
                    playAmrBlob(blob);
                });
                $(e).attr("class", "audioPlayIn");

                setTimeout(function() {
                    $(e).attr("class", "audioPlay");
                }, 10000);
            }
        });
    }
}
//表格上面的操作按钮
var tableOperationObj = {
    $exportAll: $("#export_all"),
    $exportChoice: $("#export_choice"),
    $mapChoice: $("#map_choice"),
    expoerObj: {
        "status": "", //处理状态，括号内为注释
        "type": "", //事件类型,
        "startDate": "", //开始日期
        "endDate": "", //结束日期
        "keyword": "",
        "ids": ""
    },
    init: function() {
        var _this = this;
        //导出全部
        this.$exportAll.click(function() {
            _this.expoerObj.ids = '';
            _this.expoerCondition();
            if (zhugeSwitch == 1) {
                zhuge.track('导出任务列表', {
                    'action': '导出全部'
                });
            }
        });
        //导出所选
        this.$exportChoice.click(function() {
            var selectionsData = $('#task_table').bootstrapTable('getSelections');
            var taskIds = [];
            if (selectionsData.length == 0) {
                xxwsWindowObj.xxwsAlert("请选择你需要导出的任务！");
                return false;
            } else {
                for (var i = 0; i < selectionsData.length; i++) {
                    taskIds.push(selectionsData[i].taskId);
                }
                _this.expoerObj.ids = taskIds.join(',');
                _this.expoerCondition();
                if (zhugeSwitch == 1) {
                    zhuge.track('导出任务列表', {
                        'action': '导出已选'
                    });
                }
            }
        });
        //在地图上显示所选点
        this.$mapChoice.click(function() {
            // 获取已选的信息
            var selectedPointItems = $('#task_table').bootstrapTable('getSelections');
            if (selectedPointItems.length > 0) {
                mapObj.setPointsMarkerWithCenterPointAndZoomLevel(selectedPointItems);
            } else {
                xxwsWindowObj.xxwsAlert("请选择您要展示的信息！");
            }
        });
    },
    expoerCondition: function() { //导出文件条件设置
        var searchMsg = searchObj.querryObj;
        this.expoerObj.status = searchObj.querryObj.status;
        this.expoerObj.type = searchObj.querryObj.type;
        this.expoerObj.startDate = searchObj.querryObj.startDate;
        this.expoerObj.endDate = searchObj.querryObj.endDate;
        this.expoerObj.keyword = searchObj.querryObj.keyword;

        this.expoerData(this.expoerObj);
    },
    expoerData: function(date) { //导出url等
        var options = {
            "url": '/cloudlink-inspection-task/task/exportExcel?token=' + lsObj.getLocalStorage('token'),
            "data": date,
            "method": 'post'
        }
        this.downLoadFile(options);
    },
    downLoadFile: function(options) { //导出文件的方法
        var config = $.extend(true, {
            method: 'post'
        }, options);
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