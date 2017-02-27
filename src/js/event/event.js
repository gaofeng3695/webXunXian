/*
 *初始化-日期选择器控件
 *alex 2017-2-23 modify
 */
var eventDatePickerInit = function() {
    //初始化-新建事件表单的DOM元素
    $('#datetime').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
    });
    //初始化-高级搜索的DOM元素
    $("#datetimeStart").datetimepicker({
        format: 'yyyy-mm-dd',
        minView: 'month',
        language: 'zh-CN',
        autoclose: true,
        // startDate: new Date()
    }).on("click", function() {
        $("#datetimeStart").datetimepicker("setEndDate", $("#datetimeEnd").val())
    });
    //初始化-高级搜索的DOM元素
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

/*
 *初始化-高级搜索的DOM元素
 *alex 2017-2-23 modify
 */
var searchModelInit = function() {
    //高级搜索-查询条件注册点击事件
    $(".main_list").each(function() {
        $(this).find("span").click(function() {
            $(this).attr("class", "active").siblings("span").attr("class", "");
            var index = $('.status_nav').find('.active').index();

            //事件状态-高级查询的change-触发普通查询的联动
            var status = $(".status_relation2").find('.active').index();
            $(".status_relation1 label").eq(status).addClass("active").siblings("label").removeClass("active");

            //时间状态-高级查询的change-触发普通查询的联动
            var status = $(".status_relation4").find('.active').index();
            $(".status_relation3 label").eq(status).addClass("active").siblings("label").removeClass("active");

            if (index == 0) {
                $(".status_list").hide();
            } else {
                $(".status_list").show();
                $(".status_list li").eq(index - 1).show().siblings("li").hide();
            }

            refreshTableData();
        });
    });
    // 事件状态-普通查询的change-触发高级查询的联动
    $(".status_relation1 label").each(function(e) {
        $(this).click(function() {
            $(".status_relation2 span").eq(e).attr("class", "active").siblings("span").attr("class", "")
        });
    });
    // 时间状态-普通查询的change-触发高级查询的联动
    $(".status_relation3 label").each(function(e) {
        $(this).click(function() {
            $(".status_relation4 span").eq(e).attr("class", "active").siblings("span").attr("class", "")
        });
    });
}

/*
 *高级搜索（按钮）的封装对象
 *控制高级搜索的查询条件的展开和收缩
 *alex 2017-2-23 modify
 */
var searchModelSwitchObj = {
    $Btn: $(".btn_search"),
    $main: $(".nav_main"),
    init: function() {
        var _this = this;
        this.$Btn.click(function() {
            _this.control();
        });
    },
    control: function() {
        if (this.$main.is(":hidden")) {
            this.show();
        } else {
            this.hide();
        }
    },
    hide: function() {
        this.$main.slideUp();
        this.$Btn.find("span").attr("class", "glyphicon glyphicon-menu-down");
    },
    show: function() {
        this.$main.slideDown();
        this.$Btn.find("span").attr("class", "glyphicon glyphicon glyphicon-menu-up");
    }
};

/*
 *新增事件对象
 *alex 2017-2-23 modify
 */
var eventObj = {
    $addBtn: $("#btn_add"),
    $submit: $(".submit"),
    $mapA: $(".map_address"),
    $lon: $("input[name=lon]"),
    $lat: $("input[name=lat]"),
    $eventM: $("#addEvent"),
    $mapM: $("#event_address"),
    $eventId: null,
    $flg: true,
    init: function() {
        var _this = this;
        this.$addBtn.click(function() { //打开事件模态框
            _this.eventOpen();
        });
        this.$mapA.click(function() { //打开地图模态框
            _this.mapOpen();
        });
        this.$submit.click(function() { //事件上报
            _this.submit();
        });
        this.getType();
    },
    eventOpen: function() { //打开摸态窗口
        this.$eventM.modal();
    },
    mapOpen: function() { //打开地图摸态窗口
        this.$mapM.modal();
        this.iconHide();
    },
    submit: function() { //提交表单
        this.$eventId = baseOperation.createuuid();
        var occurrenceTime = $("#datetime").val();
        var address = this.$mapA.val();
        var description = $("#event_description").val().trim();
        if (this.$flg == true) {
            this.$flg = false;
            if (occurrenceTime == "") {
                alert("请选择发生事件的时间!");
                this.again();
                return false;
            } else if (address == "") {
                alert("请选择发生事件的地点!");
                this.again();
                return false;
            } else if (description == "") {
                alert("请描述发生的事件!");
                this.again();
                return false;
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
                    url: "/cloudlink-core-file/attachment/save?businessId=" + _this.$eventId + "&bizType=pic&token=" + mapObj.$token,
                    /*这是处理文件上传的servlet*/
                    secureuri: false,
                    fileElementId: picId, //上传input的id
                    dataType: "JSON",
                    type: "POST",
                    async: false,
                    success: function(data, status) {
                        console.log(data);
                        // var reg = /<pre.+?>(.+)<\/pre>/g;
                        // var result = data.match(reg);
                        // data = RegExp.$1;
                        // console.log(data);
                        // console.log(result);
                        var statu = JSON.parse(data).success;
                        console.log(statu);
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
            url: "/cloudlink-inspection-event/eventInfo/saveBatch?token=" + mapObj.$token,
            contentType: "application/json",
            data: JSON.stringify(eventData),
            dataType: "json",
            success: function(data, status) {
                if (data.success == 1) {
                    _this.$eventM.modal('hide');
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
        var occurrenceTime = $("#datetime").val();
        var address = _this.$mapA.val();
        var description = $("#event_description").val().trim();

        var status = $("input[name=state]").val();

        var eventCode = (new Date()).Format("yyyyMMddHHmmssS");
        var reportTime = (new Date()).Format("yyyy-MM-dd");

        var user = mapObj.$user;
        var dataArr = [];
        var dataMsg = {
            "objectId": this.$eventId,
            "type": $("#eventType").val(),
            "occurrenceTime": occurrenceTime,
            "address": _this.$mapA.val(),
            "description": description,
            "eventCode": eventCode,
            "reportTime": reportTime,
            "status": status,
            "bdLon": _this.$lon.val(),
            "bdLat": _this.$lat.val(),
            "lon": "0",
            "lat": "0",
            "taskUserMsg": [{
                "userId": user.objectId,
                "userName": user.userName
            }]
        }
        dataArr.push(dataMsg);
        return dataArr;
    },
    getType: function() {
        $.ajax({
            type: 'GET',
            url: "/cloudlink-inspection-event/eventType/getTree",
            contentType: "application/json",
            dataType: "json",
            success: function(data, status) {
                var typeList = data.rows[0].root.children;
                var txt = null;
                for (i = 0; i < typeList.length; i++) {
                    for (j = 0; j < typeList[i].children.length; j++) {
                        txt += '<option value=' + typeList[i].children[j].indexNum + '>' + typeList[i].text + '&nbsp-&nbsp' + typeList[i].children[j].text + '</option>'
                    }
                }
                $("#eventType").append(txt);
            }
        })
    },
    iconHide: function() { //隐藏百度图标与文字
        $(".BMap_cpyCtrl.BMap_noprint.anchorBL,.anchorBL").hide();
        $(".anchorBL a").hide();
    },
    again: function() {
        this.$flg = true;
    }
}

/*
 *新增事件 针对子地图的对象
 *alex 2017-2-23 modify
 */
var mapAddObj = { //上报事件地图
    $map: new BMap.Map("address_map"), // 创建Map实例
    $text: $("input[name=map_address]"),
    $dataPass: $(".dataPass"),
    $val: $(".search_val"),
    $botton: $(".search_botton"),
    $lon: null,
    $lat: null,
    $marker: null,
    $point: null,
    $address: new BMap.Geocoder(),
    init: function() {
        var _this = this;
        this.$lon = 116.404;
        this.$lat = 38.915;
        this.$point = new BMap.Point(this.$lon, this.$lat);
        this.$map.centerAndZoom(this.$point, 15);
        this.$map.enableScrollWheelZoom(); //启用滚轮放大缩小
        this.$map.addEventListener("click", function(e) {
            _this.$lon = e.point.lng;
            _this.$lat = e.point.lat;
            _this.remove();
            _this.add();
        });
        this.$botton.click(function() {
            var local = new BMap.LocalSearch(_this.$map, {
                renderOptions: {
                    map: _this.$map
                }
            });
            local.search(_this.$val.val().trim());
        });
        this.$dataPass.click(function() {
            if (_this.$text.val() == '') {
                alert("请选择地理位置！")
            } else {
                eventObj.$mapA.val(_this.$text.val()); //传地址过去
                eventObj.$lon.val(_this.$lon);
                eventObj.$lat.val(_this.$lat);
                eventObj.$mapM.modal('hide');
            }
        })
    },
    add: function() {
        this.$point = new BMap.Point(this.$lon, this.$lat);
        this.$marker = new BMap.Marker(this.$point); // 创建标注
        this.$map.addOverlay(this.$marker); // 将标注添加到地图中

        var _this = this;
        // 根据坐标得到地址描述    
        this.$address.getLocation(this.$point, function(result) {
            if (result) {
                _this.$text.val(result.address);
            }
        });
    },
    remove: function() {
        // this.$map.removeOverlay(this.$marker);
        this.$map.clearOverlays(); //清除所以的点
    }
}

/*
 *监听页面的相关事件
 *alex 2017-2-23 modify
 */
var addListenEventHandle = function() {

    //地图展示已选-点击事件
    $("#map_choice").click(function() {
        var selectedPointItems = $('#table').bootstrapTable('getSelections');
        // alert(selectedPointItems.length);
        if (selectedPointItems.length > 0) {
            mapObj.setPointsMarkerWithCenterPointAndZoomLevel(selectedPointItems);
        } else {
            alert("请选择地图展示的数据。");
        }
    });

    //地图的展开和收缩-点击事件
    $(".bottom_btn span").click(function() {
        mapObj.mapSwitch();
    });


    //上传图片-点击事件
    $(".addImg").click(function() {
        var imgNum = $(".feedback_img_list").find(".feedback_images").length;
        if (imgNum <= 4) {
            $("#upload").trigger("click");
        } else {
            alert("最多上传五张图片");
        }
    });

    //新建事件是否报送-点击change事件
    $(".pay_list_c1").each(function(e) {
        $(this).click(function() {
            $(".pay_list_c1").removeClass("on");
            $(this).addClass("on");
            $(this).find("input[type='radio']").prop("checked", true);
        })
    });

    //通过该方法来为每次弹出的模态框设置最新的zIndex值，从而使最新的modal显示在最前面
    $(document).on('show.bs.modal', '.modal', function(event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
}


/*
 *事件地图的对象
 *alex 2017-2-23
 */
var mapObj = {
    $token: lsObj.getLocalStorage('token'),
    $user: JSON.parse(lsObj.getLocalStorage("userBo")),
    $mapBtn: $(".bottom_btn span"),
    $mapO: $("#event_map"), //百度地图DIV容器
    $bdMap: new BMap.Map("event_map"), //创建百度地图实例
    $zoom: ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"],
    aCurrentPoints: [],
    init: function() { //地图初始化方法
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
        eventObj.iconHide();
    },
    setMark: function(data) {
        var txts = null;
        var myIcons = null;
        var markers = null;
        var point = null;
        var label = null;
        for (var i = 0; i < data.length; i++) {
            txts = '<div><p>事件类型：' + data[i].fullTypeName + '</p>' +
                '<p>事件状态：' + data[i].statusValue + '</p>' +
                '<p>上报人：' + data[i].inspectorName + '</p></div>';

            point = new BMap.Point(data[i].bdLon, data[i].bdLat);
            label = new BMap.Label("" + data[i].objectId, {
                offset: new BMap.Size(20, -10)
            });
            label.setStyle({
                'display': 'none'
            });
            if (data[i].parentTypeId == 1) {
                myIcons = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
            } else if (data[i].parentTypeId == 2) {
                myIcons = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
            } else if (data[i].parentTypeId == 3) {
                myIcons = new BMap.Icon("/src/images/event/pip1.png", new BMap.Size(29, 42));
            }
            markers = new BMap.Marker(point, {
                icon: myIcons
            });
            markers.setLabel(label);
            this.$bdMap.addOverlay(markers);
            this.addClickHandler(txts, markers)
        }
    },
    //地图打点并计算中心点及缩放等级
    setPointsMarkerWithCenterPointAndZoomLevel: function(data) {
        this.$bdMap.clearOverlays(); //清除地图上已经标注的点
        var maxPointAndMinPointObj = this.getMaxPointAndMinPoint(data); //计算当前数据中 最大的经纬度 及 最小的经纬度
        // alert(JSON.stringify(maxPointAndMinPointObj));
        var centerPointAndZoomLevel = this.getCenterPointAndZoomLevel(maxPointAndMinPointObj.maxLon, maxPointAndMinPointObj.maxLat, maxPointAndMinPointObj.minLon, maxPointAndMinPointObj.minLat);
        this.$bdMap.centerAndZoom(centerPointAndZoomLevel.centerPoint, centerPointAndZoomLevel.zoomlevel); //设置中心点
        this.setPointsMarker(data);
    },
    //地图打点(多个点)
    setPointsMarker: function(data) {
        //this.$bdMap.clearOverlays(); //清除地图上已经标注的点
        var txts = null;
        var myIcons = null;
        var markers = null;
        var point = null;
        var label = null;
        this.aCurrentPoints = [];
        for (var i = 0; i < data.length; i++) {
            txts = '<div><p>事件类型：' + data[i].fullTypeName + '</p>' +
                '<p>事件状态：' + data[i].statusValue + '</p>' +
                '<p>上报人：' + data[i].inspectorName + '</p></div>';

            point = new BMap.Point(data[i].bdLon, data[i].bdLat);
            label = new BMap.Label("" + data[i].objectId, {
                offset: new BMap.Size(20, -10)
            });
            label.setStyle({
                'display': 'none'
            });
            if (data[i].parentTypeId == 1) {
                myIcons = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
            } else if (data[i].parentTypeId == 2) {
                myIcons = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
            } else if (data[i].parentTypeId == 3) {
                myIcons = new BMap.Icon("/src/images/event/pip1.png", new BMap.Size(29, 42));
            }
            markers = new BMap.Marker(point, {
                icon: myIcons
            });
            markers.setLabel(label);
            this.$bdMap.addOverlay(markers);
            //将当前地图上的坐标点 赋值全局变量
            this.aCurrentPoints.push({
                'key': data[i].objectId,
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
        //alert(distance);
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
            if (this.aCurrentPoints[i].key == selectedItem.objectId) {
                isExist++;
                this.aCurrentPoints[i].value.setAnimation(BMAP_ANIMATION_BOUNCE);

            } else {
                this.aCurrentPoints[i].value.setAnimation();
            }
        }
        if (isExist > 0) return;
        var _point = new BMap.Point(selectedItem.bdLon, selectedItem.bdLat);
        var _marker = new BMap.Marker(_point); // 创建标注

        this.$bdMap.addOverlay(_marker); // 将标注添加到地图中 
        _marker.setAnimation(BMAP_ANIMATION_BOUNCE);
        this.aCurrentPoints.push({
            key: selectedItem.objectId,
            value: _marker
        });
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
        mapObj.$bdMap.openInfoWindow(infoWindow, point); //开启信息窗口
    }
};

/*删除图片*/
function closeImg(e) {
    $(e).closest(".feedback_images").remove();
}

//点击查看详情地图
var detailsMapObj = {
    $btn: $(".address"),
    $main: $("#details_address_map"),
    // $detailsMap: null,
    // init: function(lon, lat) {
    //     console.log("Dddd")
    //     var _this = this;
    //     this.$detailsMap = new BMap.Map("details_address_map")
    //     this.$detailsMap.enableScrollWheelZoom(true);
    //     var point = new BMap.Point(lon, lat);
    //     this.$detailsMap.centerAndZoom(point, 15);
    //     var myIcon = new BMap.Icon("/src/images/event/personal.png", new BMap.Size(130, 130));
    //     var marker = new BMap.Marker(point, {
    //         icon: myIcon
    //     });
    //     this.$detailsMap.clearOverlays();
    //     this.$detailsMap.addOverlay(marker);

    //     this.$btn.click(function() {
    //         console.log("bb")
    //         _this.control();
    //     })
    // },
    init: function() {
        var _this = this;
        this.$btn.click(function() {
            _this.control();
        })
    },
    control: function() {
        if (this.$main.is(":hidden")) {
            this.show();
        } else {
            this.hide();
        }
    },
    hide: function() {
        this.$main.slideUp();
    },
    show: function() {
        this.$main.slideDown();
        eventObj.iconHide();
    }
}

/*
 *初始化-查询条件-对象
 */
var searchObject = {
    "status": "20", //处理状态，括号内为注释
    "type": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16", //事件类型,
    "startDate": "2017-02-21", //开始日期
    "endDate": "2017-02-23", //结束日期
    "keyword": "", //关键词模糊搜索  任务编号，任务状态，事件类型，最新处置类型，任务发起人（createUser），
    "pageNum": 1, //第几页
    "pageSize": 10 //每页记录数
}

/*
 *初始化表单的方法
 */
function initTable() {
    $('#table').bootstrapTable({
        url: "/cloudlink-inspection-event/eventInfo/web/v1/getPageList?token=" + mapObj.$token, //请求数据url
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
            searchObject.pageSize = params.pageSize;
            searchObject.pageNum = params.pageNumber;
            return searchObject;
        },
        responseHandler: function(res) {
            return res;
        },
        onLoadSuccess: function(data) {
            // alert(data.rows.length);
            if (data.rows.length > 0) {
                mapObj.setPointsMarkerWithCenterPointAndZoomLevel(data.rows);
            }
        },
        //表格的列
        columns: [{
            field: 'state', //域值
            checkbox: true, //复选框
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '5%',
        }, {
            field: 'occurrenceTime', //域值
            title: '事件发生时间',
            align: 'center',
            visible: true, //false表示不显示
            sortable: true, //启用排序
            width: '15%',
            editable: true,
        }, {
            field: 'fullTypeName', //域值
            title: '事件类型', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: true, //启用排序
            width: '15%',
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
            field: 'statusValue', //域值
            title: '事件状态', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: true, //启用排序
            width: '10%',
            editable: true,
        }, {
            field: 'address', //域值
            title: '事件地点', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '25%',
            // editable: true,
        }, {
            field: 'inspectorName', //域值
            title: '上报人', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: true, //启用排序
            width: '10%',
            editable: true,
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            events: operateEvents,
            width: '20%',
            formatter: operateFormatter
        }]
    });
}

/*
 *点击查询条件-刷新bootstrap列表的数据
 */
function refreshTableData() {
    $('#table').bootstrapTable('refreshOptions', {
        queryParams: function(params) {
            return searchObject;
        }
    });
}

/*
 *表单的操作（html样式）
 */
function operateFormatter(value, row, index) {
    return [
        '<a class="location" href="javascript:void(0)" title="定位">',
        '<i></i>',
        '</a>&nbsp;&nbsp;&nbsp;&nbsp;',
        '<a class="check" data-toggle="modal" href="javascript:void(0)" title="查看">',
        '<i></i>',
        '</a>',
    ].join('');
}

// 表格操作的事件
window.operateEvents = {
    //定位功能
    'click .location': function(e, value, row, index) {
        if ($(this).find('i').attr("class") == 'active') {} else {
            $(".location").find('i').attr("class", "");
            $(this).find('i').attr("class", "active");
            mapObj.singlePointLocation(row);
        }
        return false;
    },
    //查看详情
    'click .check': function(e, value, row, index) {
        if ($(this).find('i').attr("class") == 'active') {} else {
            $(".check").find('i').attr("class", "");
            $(this).find('i').attr("class", "active");
        }
        var objId = row.objectId;
        var lon = row.bdLon;
        var lat = row.bdLat;
        $("#details").modal(); //打开详情模态框
        $.ajax({
            type: 'GET',
            url: "/cloudlink-inspection-event/eventInfo/get?eventId=" + objId,
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
                eventObj.iconHide(); //隐藏百度图标

                console.log(JSON.stringify(data));
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
                        console.log(data.rows[0].fileUrl);
                        $(".event_audio").attr("src", '' + data.rows[0].fileUrl);
                    }
                })
            }
        })
        return false;
    }
};


$(function() {
    eventDatePickerInit(); //初始化-日期选择器控件
    searchModelInit(); //初始化-高级搜索的DOM元素
    searchModelSwitchObj.init(); //初始化-高级搜索按钮
    mapObj.init(); //地图初始化
    eventObj.init(); //初始化-事件上报
    mapAddObj.init(); //初始化-事件上报地图
    addListenEventHandle(); //注册事件
    initTable(); //初始化表格数据
});