$(function() {
    mapObj.init(); //地图初始化
    eventObj.init(); //事件信息初始化
    inspectObj.init(); //巡检信息初始化
})

// 地图对象
var mapObj = {
    $bdMap: new BMap.Map("container"), //创建百度地图实例  
    $zoom: ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"],
    init: function() {
        //初始化地图
        var point = new BMap.Point(116.404, 39.915); // 创建点坐标
        this.$bdMap.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
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


        // var myDis = new BMapLib.DistanceTool(_this.$bdMap);
        // this.$distance.click(function() {
        //     _this.$bdMap.addEventListener("mouseover", function() {
        //         myDis.open(); //开启鼠标测距
        //         //myDis.close();  //关闭鼠标测距大
        //     });
        // });
    },
    //地图打点并计算中心点及缩放等级
    setPointsMarkerWithCenterPointAndZoomLevel: function(data) {
        // this.$bdMap.clearOverlays(); //清除地图上已经标注的点
        var maxPointAndMinPointObj = this.getMaxPointAndMinPoint(data); //计算当前数据中 最大的经纬度 及 最小的经纬度
        // alert(JSON.stringify(maxPointAndMinPointObj));
        var centerPointAndZoomLevel = this.getCenterPointAndZoomLevel(maxPointAndMinPointObj.maxLon, maxPointAndMinPointObj.maxLat, maxPointAndMinPointObj.minLon, maxPointAndMinPointObj.minLat);
        this.$bdMap.centerAndZoom(centerPointAndZoomLevel.centerPoint, centerPointAndZoomLevel.zoomlevel); //设置中心点


        eventObj.setEventPointsMarker(data);
        // this.setInspectPointsMarker(data);
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
}

//事件相关
var eventObj = {
    $eventBtnOpen: $(".aa"),
    $eventBtnClose: $(".bb"),
    _eventData: null, //初始化数据
    eventStartPoints: [], //初始化事件点的数组
    eventPoints: [], //页面展示事件点的数组
    eventConditionObj: {
        "status": "20", //处理状态，固定为20 处理中事件
        "type": "", //事件类型, 固定为1,2,3 
        "startDate": "2016-10-01", //开始日期 固定为2016-10-01
        "endDate": "", //结束日期 当前系统时间
        "keyword": "", //固定为空，
        "userIds": "", // 逗号分隔的userId 输入查询用户ID
        "pageNum": 1, //第几页
        "pageSize": 100 //每页记录数
    },
    // $distance: $(".distance"), //测距离
    init: function() {
        var _this = this;
        //初始化获取事件信息
        this.getEventData();

        //打开事件点
        this.$eventBtnOpen.click(function() {
            console.log(_this.eventStartPoints.length)
            for (var i = 0; i < _this.eventStartPoints.length; i++) {
                _this.$bdMap.addOverlay(_this.eventStartPoints[i].value);
            }
        });
        //关闭事件点
        this.$eventBtnClose.click(function() {
            console.log(_this.eventStartPoints.length)
            for (var i = 0; i < _this.eventStartPoints.length; i++) {
                _this.$bdMap.removeOverlay(_this.eventStartPoints[i].value);
            }
        });
    },
    assignmentPoints: function() { //初始化事件点信息
        for (var i = 0; i < this.eventPoints.length; i++) {
            this.eventStartPoints[i] = this.eventPoints[i];
        }
    },
    //设置地图事件点
    setEventPointsMarker: function(data) {
        // mapObj.$bdMap.clearOverlays(); //清除地图上已经标注的点
        var _this = this;
        var myIcons = null;
        var markers = null;
        var point = null;
        this.eventPoints = [];
        for (var i = 0; i < data.length; i++) {
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
            //将当前地图上的坐标点 赋值全局变量
            this.eventPoints.push({
                'key': data[i].objectId,
                'value': markers
            });
            this.setPointsToMap();
            //添加点击事件
            markers.addEventListener("click", function(e) {
                _this.eventPointClick(e);
            });
        }
    },
    setPointsToMap: function() { //给地图添加事件点
        for (var i = 0; i < this.eventPoints.length; i++) {
            mapObj.$bdMap.addOverlay(this.eventPoints[i].value);
        }
    },
    eventPointClick: function(e) { //事件标注点的点击事件
        // debugger;
        var pointAll = mapObj.$bdMap.getOverlays();
        for (var i = 0; i < pointAll.length; i++) {
            pointAll[i].setAnimation();
        }
        var p = e.target;
        p.setAnimation(BMAP_ANIMATION_BOUNCE); //添加跳动
        for (var i = 0; i < this.eventStartPoints.length; i++) {
            if (this.eventStartPoints[i].value == p) {
                console.log(this.eventStartPoints[i].key);
            }
        }
    },
    getEventData: function() {
        var _this = this;
        $.ajax({
            type: 'POST',
            url: "/cloudlink-inspection-event/eventInfo/web/v1/getPageList?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(_this.eventConditionObj),
            dataType: 'json',
            success: function(data, status) {
                _this._eventData = data;
                console.log(_this._eventData)
                mapObj.setPointsMarkerWithCenterPointAndZoomLevel(_this._eventData.rows);
            }
        })
    }
}

//巡检人员相关
var inspectObj = {
    _inspectData: null, //初始化数据
    inspectStartPoints: [], //初始化巡检点的数组
    inspectDisplayPoints: [], //页面展示巡检点的数组
    init: function() {

    },
    setInspectPointsMarker: function(data) { //巡检人员添加设置标注点
        var _this = this;
        var myIcons = new BMap.Icon("/src/images/event/people.png", new BMap.Size(29, 42));;
        var markers = null;
        var point = null;
        this.inspectStartPoints = [];
        for (var i = 0; i < data.length; i++) {
            point = new BMap.Point(data[i].bdLon, data[i].bdLat);
            markers = new BMap.Marker(point, {
                icon: myIcons
            });
            this.$bdMap.addOverlay(markers);
            //将当前地图上的坐标点 赋值全局变量
            this.inspectStartPoints.push({
                'key': data[i].objectId,
                'value': markers
            });
            //添加点击事件
            markers.addEventListener("click", function(e) {
                _this.pointClick(e);
            });
        }
    },
    inspectPointClick: function(e) { //巡检人员标注点的点击事件
        var pointAll = this.$bdMap.getOverlays();
        for (var i = 0; i < aa.length; i++) {
            pointAll[i].setAnimation();
        }
        var p = e.target;
        p.setAnimation(BMAP_ANIMATION_BOUNCE); //添加跳动
        for (var i = 0; i < this.inspectStartPoints.length; i++) {
            if (this.inspectStartPoints[i].value == p) {
                console.log(this.inspectStartPoints[i].key);
            }
        }
    },
    getEventData: function() {
        var _this = this;
        $.ajax({
            type: 'GET',
            url: "/cloudlink-inspection-event/inspectionMonitor/v1/getList4Web?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            dataType: 'json',
            success: function(data, status) {
                _this._eventData = data;
                console.log(_this._eventData)
                mapObj.setPointsMarkerWithCenterPointAndZoomLevel(_this._eventData.rows);
            }
        })
    }
}