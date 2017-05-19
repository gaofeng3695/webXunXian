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
    $receiveUser: $("input[name=receiveUser]"),
    receiveUserIdsArr: [],
    _eventObjectId: null,
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
        this.$receiveUser.click(function() {
            $("#stakeholder").modal(); //打开人员模态框
            _this.requestPeopleTree();
        });
        $('#btn_selectPeople').click(function() { //确定选择人员
            _this.setSelectedPerson();
            //console.log(that.querryObj);
        });

        //地图模态框加载完加载
        this.$mapM.on('shown.bs.modal', function() {
            mapAddObj.reload();
        });
        //详情模态框加载完加载
        $('#details').on('shown.bs.modal', function(e) {
            detailsObj.loadEventDetails(_this._eventObjectId);
        });
        this.getType();
    },
    eventOpen: function() { //打开摸态窗口
        var time = (new Date()).Format("yyyy-MM-dd HH:mm");
        $("#datetime").val(time);
        this.$eventM.modal();
    },
    mapOpen: function() { //打开地图摸态窗口
        this.$mapM.modal();
        this.iconHide();
    },
    submit: function() { //提交表单
        var _this = this;
        this.$eventId = baseOperation.createuuid();
        var occurrenceTime = $("#datetime").val();
        var address = this.$mapA.val();
        var description = $("#event_description").val().trim();
        if (this.$flg == true) {
            this.$flg = false;
            if (occurrenceTime == "") {
                xxwsWindowObj.xxwsAlert("请选择发生事件的时间!");
                this.again();
                return false;
            } else if (address == "") {
                xxwsWindowObj.xxwsAlert("请选择发生事件的地点!");
                this.again();
                return false;
            } else if (description == "") {
                xxwsWindowObj.xxwsAlert("请描述发生的事件!");
                this.again();
                return false;
            } else {
                var defaultOptions = {
                    tip: '您是否确定上报事件？',
                    name_title: '提示',
                    name_cancel: '取消',
                    name_confirm: '确定',
                    isCancelBtnShow: true,
                    callBack: function() {
                        _this.uploadFile();
                    }
                };
                xxwsWindowObj.xxwsAlert(defaultOptions);
                this.again();
            }
        }

    },
    uploadFile: function() {
        var nImgHasBeenSendSuccess = 0;
        var _this = this;
        var files = $(".feedback_img_file").find("input[name=file]");
        // var files = $(".feedback_img_list").find("input[name=file]");
        if (files.length > 0) {
            for (i = 0; i < files.length; i++) {
                var picId = files.eq(i).attr("id");
                $.ajaxFileUpload({
                    url: "/cloudlink-core-file/attachment/web/v1/save?businessId=" + _this.$eventId + "&bizType=pic&token=" + lsObj.getLocalStorage('token'),
                    /*这是处理文件上传的servlet*/
                    secureuri: false,
                    fileElementId: picId, //上传input的id
                    dataType: "json",
                    type: "POST",
                    async: false,
                    success: function(data, status) {
                        var statu = data.success;
                        if (statu == 1) {
                            nImgHasBeenSendSuccess++;
                            if (nImgHasBeenSendSuccess == files.length) {
                                //上传表单
                                _this.uploadData();
                            }
                        } else {
                            xxwsWindowObj.xxwsAlert("当前网络不稳定");
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
        // console.log(JSON.stringify(eventData));
        $.ajax({
            type: 'POST',
            url: "/cloudlink-inspection-event/eventInfo/saveBatch?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(eventData),
            dataType: "json",
            success: function(data, status) {
                if (data.success == 1) {
                    $("input[type='text']").val("");
                    _this.$eventM.modal('hide');
                    window.location.reload();
                } else {
                    xxwsWindowObj.xxwsAlert("保存事件失败！");
                    _this.again();
                }
            }
        })
    },
    formData: function() {
        // debugger;
        var _this = this;
        var occurrenceTime = $("#datetime").val();
        var address = _this.$mapA.val();
        var description = $("#event_description").val().trim();

        var status = $("input[name=state]:checked").val();
        var eventCode = (new Date()).Format("yyyyMMddHHmmssS");
        var reportTime = (new Date()).Format("yyyy-MM-dd");
        var user = {
            "userId": mapObj.$user.objectId,
            "userName": mapObj.$user.userName
        }
        _this.receiveUserIdsArr.push(user);
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
            "taskUserMsg": _this.receiveUserIdsArr
        }
        dataArr.push(dataMsg);
        return dataArr;
    },
    getType: function() {
        $.ajax({
            type: 'GET',
            url: "/cloudlink-inspection-event/eventType/getTree?token=" + lsObj.getLocalStorage('token'),
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
    requestPeopleTree: function() { //请求人员信息
        var that = this;
        if (that.aAllPeople) {
            return;
        }
        $.ajax({
            type: "GET",
            url: "/cloudlink-core-framework/user/getOrgUserTree",
            contentType: "application/json",
            data: {
                token: lsObj.getLocalStorage('token'),
                status: 1
            },
            dataType: "json",
            success: function(data) {
                // console.log(JSON.stringify(data));
                var peopleAllArr = data.rows;
                if (data.success != 1) {
                    xxwsWindowObj.xxwsAlert('获取人员信息失败！');
                    return;
                }

                //数组中删除本人
                for (var i = 0; i < peopleAllArr.length; i++) {
                    if (peopleAllArr[i].id == mapObj.$user.objectId) {
                        peopleAllArr.splice(i, 1);
                    }
                }
                that.aAllPeople = peopleAllArr;
                that.renderPeopleTree(that.aAllPeople);
            },
            statusCode: {
                404: function() {
                    xxwsWindowObj.xxwsAlert('获取人员信息失败！');
                }
            }
        });
    },
    renderPeopleTree: function(data) { //遍历tree
        var that = this;
        //data = '';
        // console.log(data)
        ////console.log(JSON.stringify(data))
        var setting = {
            view: {
                showLine: true
            },
            data: {
                key: {
                    name: 'treenodename'
                },
                simpleData: {
                    enable: true,
                    pIdKey: 'pid'
                }
            },
            check: {
                enable: true,
                chkStyle: "checkbox",
            }
        };
        that.zTree = $.fn.zTree.init($("#people_list"), setting, data);
        that.zTree.expandAll(true);
    },
    setSelectedPerson: function() { //获取选中的人员
        var that = this;
        // that.aPeopleId = [];
        that.aPeopleName = [];
        that.receiveUserIdsArr = []; //人员数组
        var userObj = null;
        var arr = that.zTree.getCheckedNodes(true);
        arr.forEach(function(item, index) {
            if (item.isParent) {
                return;
            }
            userObj = {
                "userId": item.id,
                "userName": item.treenodename
            }
            that.receiveUserIdsArr.push(userObj);
            // that.aPeopleId.push(item.id);
            that.aPeopleName.push(item.treenodename);
        });
        that.$receiveUser.val(that.aPeopleName.join('，'));
        $('#stakeholder').modal('hide');
        // console.log(JSON.stringify(this.formData()));
        // console.log(that.aPeopleName);
        // receiveUserIdsArr
    },
    initPeopleList: function() { //清空人员信息
        var that = this;
        that.aPeopleName = [];
        that.receiveUserIdsArr = [];
        that.$receiveUser.val('');
        if (that.zTree) {
            that.zTree.checkAllNodes(false);
        }
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
        // debugger;

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
        // this.$map.addControl(bottom_left_ScaleControl);
        // this.$map.addControl(bottom_right_navigation);
        // this.$map.addControl(new BMap.MapTypeControl());


        var _this = this;

        this.$map.addEventListener("click", function(e) { //添加选择点
            _this.$lon = e.point.lng;
            _this.$lat = e.point.lat;
            _this.remove();
            _this.add();
        });
        this.$botton.click(function() { //地点搜索
            // xxwsWindowObj.xxwsAlert(_this.$val.val().trim())
            // debugger;
            var local = new BMap.LocalSearch(_this.$map, {
                renderOptions: {
                    map: _this.$map
                }
            });
            local.search(_this.$val.val().trim());
        });
        this.$dataPass.click(function() { //地址传到上报页面
            // console.log("dddd")
            if (_this.$text.val() == '') {
                xxwsWindowObj.xxwsAlert("请选择详细位置！");
                return false;
            } else {
                eventObj.$mapA.val(_this.$text.val()); //传地址过去
                eventObj.$lon.val(_this.$lon);
                eventObj.$lat.val(_this.$lat);
                eventObj.$mapM.modal('hide');
            }
        })
    },
    reload: function() { //重新加载地图
        this.$map.centerAndZoom(new BMap.Point(116.404, 39.915), 9); // 初始化地图,设置中心点坐标和地图级别
        this.$map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
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
        // xxwsWindowObj.xxwsAlert(selectedPointItems.length);
        if (selectedPointItems.length > 0) {
            mapObj.setPointsMarkerWithCenterPointAndZoomLevel(selectedPointItems);
        } else {
            xxwsWindowObj.xxwsAlert("请选择您要展示的信息！");
        }
    });

    // 地图的展开和收缩 - 点击事件
    $(".bottom_btn span").click(function() {
        mapObj.mapSwitch();
    });


    //上传图片-点击事件
    $(".addImg").click(function() {
        var imgNum = $(".feedback_img_list").find(".feedback_images").length;
        if (imgNum <= 4) {
            $(".upload_file").trigger("click");
        } else {
            xxwsWindowObj.xxwsAlert("最多上传五张图片");
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
    $(document).on('hidden.bs.modal', '.modal', function(event) {
        if ($('.modal:visible').length > 0) {
            $("body").addClass("modal-open");
        }
    });
}


/*
 *事件地图的对象
 *alex 2017-2-23
 */
var mapObj = {
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
    //地图打点并计算中心点及缩放等级
    setPointsMarkerWithCenterPointAndZoomLevel: function(data) {
        this.$bdMap.clearOverlays(); //清除地图上已经标注的点

        this.aCurrentPoints = [];
        //var maxPointAndMinPointObj = this.getMaxPointAndMinPoint(data); //计算当前数据中 最大的经纬度 及 最小的经纬度
        // xxwsWindowObj.xxwsAlert(JSON.stringify(maxPointAndMinPointObj));
        //var centerPointAndZoomLevel = this.getCenterPointAndZoomLevel(maxPointAndMinPointObj.maxLon, maxPointAndMinPointObj.maxLat, maxPointAndMinPointObj.minLon, maxPointAndMinPointObj.minLat);
        //this.$bdMap.centerAndZoom(centerPointAndZoomLevel.centerPoint, centerPointAndZoomLevel.zoomlevel); //设置中心点坐标和地图级别

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
        for (var i = 0; i < data.length; i++) {
            txts = '<div><p>事件类型：' + data[i].fullTypeName + '</p>' +
                '<p>事件状态：' + data[i].statusValue + '</p>' +
                '<p>上报人：' + data[i].inspectorName + '</p></div>';

            point = new BMap.Point(data[i].bdLon, data[i].bdLat);
            if (data[i].parentTypeId == 1) {
                if (data[i].status == 20) {
                    myIcons = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
                } else {
                    myIcons = new BMap.Icon("/src/images/event/con2.png", new BMap.Size(29, 42));
                }
            } else if (data[i].parentTypeId == 2) {
                if (data[i].status == 20) {
                    myIcons = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
                } else {
                    myIcons = new BMap.Icon("/src/images/event/dis2.png", new BMap.Size(29, 42));
                }
            } else if (data[i].parentTypeId == 3) {
                if (data[i].status == 20) {
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

        var txts = null;
        var myIcons = null;
        txts = '<div><p>事件类型：' + selectedItem.fullTypeName + '</p>' +
            '<p>事件状态：' + selectedItem.statusValue + '</p>' +
            '<p>上报人：' + selectedItem.inspectorName + '</p></div>';

        if (selectedItem.parentTypeId == 1) {
            if (selectedItem.status == 20) {
                myIcons = new BMap.Icon("/src/images/event/con1.png", new BMap.Size(29, 42));
            } else {
                myIcons = new BMap.Icon("/src/images/event/con2.png", new BMap.Size(29, 42));
            }
        } else if (selectedItem.parentTypeId == 2) {
            if (selectedItem.status == 20) {
                myIcons = new BMap.Icon("/src/images/event/dis1.png", new BMap.Size(29, 42));
            } else {
                myIcons = new BMap.Icon("/src/images/event/dis2.png", new BMap.Size(29, 42));
            }
        } else if (selectedItem.parentTypeId == 3) {
            if (selectedItem.status == 20) {
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
            key: selectedItem.objectId,
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
    }
};

/*删除图片*/
function closeImg(e) {
    var num = $(e).attr("data-key");
    $(e).closest(".feedback_images").remove();
    $(".feedback_img_file input[name=file]").each(function() {
        console.log($(this).attr("data-value"))
        if ($(this).attr("data-value") == num) {
            $(this).remove();
        }
    })
}


//高级搜索相关的对象与方法
var searchObj = {
    $items: $('.top .item'), //搜索条件dom
    $searchInput: $('#searchInput'), //搜索关键词dom
    $startDate: $("#datetimeStart"),
    $endDate: $("#datetimeEnd"),
    // tracksIdsArr: [], //存放已被选中的轨迹ID
    defaultObj: { //默认搜索条件
        "status": "20", //20:处理中，21：已完成，:全部
        "startDate": "", //开始日期
        "endDate": "", //结束日期
        "keyword": "", //高级搜索关键词
        "type": "", //事件类型，逗号分隔的
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    querryObj: { //请求的搜索条件
        "status": "20",
        "startDate": "", //开始日期
        "endDate": "", //结束日期
        "keyword": "", //巡线人，巡线编号
        "type": "",
        "pageNum": 1, //第几页
        "pageSize": 10 //每页记录数
    },
    activeObj: { //高亮默认搜索条件，用于渲染页面
        "status": "20",
        "date": "all",
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
            // console.log(that.$searchInput.val().trim())
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
        $('#table').bootstrapTable('refreshOptions', {
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
            endDate: new Date()
        });
        $("#datetimeStart").datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
            // startDate: new Date()
        }).on("click", function() {
            $("#datetimeStart").datetimepicker("setEndDate", $("#datetimeEnd").val());
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

/*
 *初始化表单的方法
 */
function initTable() {
    $('#table').bootstrapTable({
        url: "/cloudlink-inspection-event/eventInfo/web/v1/getPageList?token=" + lsObj.getLocalStorage('token'), //请求数据url
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
            searchObj.querryObj.pageSize = params.pageSize;
            searchObj.querryObj.pageNum = params.pageNumber;
            return searchObj.querryObj;
        },
        responseHandler: function(res) {
            return res;
        },
        onLoadSuccess: function(data) {
            // xxwsWindowObj.xxwsAlert(data.rows.length);
            if (data.success == 1) {
                if (data.rows.length > 0) {
                    mapObj.setPointsMarkerWithCenterPointAndZoomLevel(data.rows);
                } else {
                    mapObj.$bdMap.clearOverlays();
                }
            }

        },
        // onDblClickRow: function(row) {
        //     var objId = row.objectId;
        //     eventObj._eventObjectId = objId;
        //     $("#details").modal(); //打开详情模态框
        // },
        //表格的列
        columns: [{
            field: 'state', //域值
            checkbox: true, //复选框
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '3%',
        }, {
            field: 'occurrenceTime', //域值
            title: '事件发生时间',
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '15%',
            editable: true,
        }, {
            field: 'fullTypeName', //域值
            title: '事件类型', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '17%',
            editable: true,
            cellStyle: function(value, row, index) {
                return {
                    css: {
                        "max-width": "300px",
                    }
                };
            }
        }, {
            field: 'statusValue', //域值
            title: '事件状态', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '10%',
            editable: true,
        }, {
            field: 'address', //域值
            title: '事件地点', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '27%',
            // editable: true,
        }, {
            field: 'inspectorName', //域值
            title: '上报人', //内容
            align: 'center',
            visible: true, //false表示不显示
            sortable: false, //启用排序
            width: '15%',
            editable: true,
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
/*
 *表单的操作（html样式）
 */
function operateFormatter(value, row, index) {
    return [
        '<a class="location" href="javascript:void(0)" title="定位">',
        '<i></i>',
        '</a>',
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
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        return false;
    },
    //查看详情
    'click .check': function(e, value, row, index) {
        var objId = row.objectId;
        eventObj._eventObjectId = objId;
        $("#details").modal(); //打开详情模态框

        // setTimeout(function() {
        //     detailsObj.loadEventDetails(objId);
        // }, 1000);
        return false;
    }
};


$(function() {
    mapObj.init(); //地图初始化
    eventObj.init(); //初始化-事件上报
    mapAddObj.init(); //初始化-事件上报地图
    addListenEventHandle(); //注册事件
    initTable(); //初始化表格数据
    searchObj.init(); //搜索条件
    exportFileObj.init(); //初始化导出表格方法

    drafting('event_map', 'drafting_down'); //启动拖拽

});



//导出文件
var exportFileObj = {
    $exportAll: $("#export_all"),
    $exportChoice: $("#export_choice"),
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
        this.$exportAll.click(function() {
            _this.expoerObj.ids = '';
            _this.expoerCondition();
            if (zhugeSwitch == 1) {
                zhuge.track('导出事件列表', {
                    'action': '导出全部'
                });
            }
        });
        this.$exportChoice.click(function() {
            var selectionsData = $('#table').bootstrapTable('getSelections');
            var objectIds = [];
            if (selectionsData.length == 0) {
                xxwsWindowObj.xxwsAlert("请选择你需要导出的任务！");
                return false;
            } else {
                for (var i = 0; i < selectionsData.length; i++) {
                    objectIds.push(selectionsData[i].objectId);
                }
                _this.expoerObj.ids = objectIds.join(',');

                _this.expoerCondition();

                if (zhugeSwitch == 1) {
                    zhuge.track('导出事件列表', {
                        'action': '导出已选'
                    });
                }
            }
        });
    },
    expoerCondition: function() {
        var searchMsg = searchObj.querryObj;
        this.expoerObj.status = searchObj.querryObj.status;
        this.expoerObj.type = searchObj.querryObj.type;
        this.expoerObj.startDate = searchObj.querryObj.startDate;
        this.expoerObj.endDate = searchObj.querryObj.endDate;
        this.expoerObj.keyword = searchObj.querryObj.keyword;

        this.expoerData(this.expoerObj);
    },
    expoerData: function(date) {
        var options = {
            "url": '/cloudlink-inspection-event/eventInfo/exportExcel?token=' + lsObj.getLocalStorage('token'),
            "data": date,
            "method": 'post'
        }
        this.downLoadFile(options);
    },
    downLoadFile: function(options) {
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

//判断输入框文字的个数
function checkLen(obj) {
    var len = $(obj).val().length;
    if (len > 159) {
        $(obj).val($(obj).val().substring(0, 160));
    }
    var num = 160 - len;
    if (num < 0) {
        num = 0;
    }
    $(".text_num").text('(' + num + '字)');
}