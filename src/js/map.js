(function resizeWrapper() {
    $('')
})();
var map;
(function () {
    /* 展现地图 */
    map = new BMap.Map("container"); // 创建地图实例
    var point = new BMap.Point(116.404, 39.915); // 创建点坐标
    map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
})();

var tabObj = {
    tabsTitle: $('.item_wrapper .item'),

    people: $('#people'),
    event: $('#event'),
    location: $('#location'),
    tool: $('#tool'),

    closeBtn: $('.result_wrapper .close_btn'),

    currentTab: null,

    init: function () {
        var that = this;
        that.bindEvent();
    },
    bindEvent: function () {
        var that = this;
        // 切换Tab事件
        that.tabsTitle.click(function () {
            var s = this.dataset.tab;
            if (s !== that.currentTab) {
                that.closeTip();
                that.showTip(s);
                return;
            }
            that.closeTip();
            $(this).removeClass('active');
        });
        //关闭tab事件
        that.closeBtn.click(function () {
            that.closeTip();
        });
        //
    },
    bindSearchEvent: function () {
        var that = this;
        $('#search_people').click(function () {

        });


    },
    requestPeople: function () {
        var that = this;
        $.ajax();
    },
    showTip: function (currentTab) {
        var that = this;
        if (!currentTab) {
            return;
        }
        $('#' + currentTab + '_title').addClass('active');
        that[currentTab].removeClass('hide');
        that.currentTab = currentTab;
    },
    closeTip: function () {
        var that = this;
        if (!that.currentTab) {
            return;
        }
        $('#' + that.currentTab + '_title').removeClass('active');
        that[that.currentTab].addClass('hide');
        that.currentTab = null;
    }
};

tabObj.init();

var data = {
    "success": 1,
    "code": "200",
    "msg": "ok",
    "totalElements": 28,
    "totalPages": 1,
    "size": 28,
    "number": 1,
    "first": true,
    "last": true,
    "rows": [{
        "createTime": 1488340180000,
        "lon": 116.349276,
        "bdLon": 116.362069,
        "lat": 39.986543,
        "bdLat": 39.993663
    }, {
        "createTime": 1488340331000,
        "lon": 116.349395,
        "bdLon": 116.362188,
        "lat": 39.986451,
        "bdLat": 39.993573
    }, {
        "createTime": 1488340345000,
        "lon": 116.34955,
        "bdLon": 116.362342,
        "lat": 39.986436,
        "bdLat": 39.99356
    }, {
        "createTime": 1488340364000,
        "lon": 116.34964,
        "bdLon": 116.362432,
        "lat": 39.986365,
        "bdLat": 39.99349
    }, {
        "createTime": 1488340384000,
        "lon": 116.349696,
        "bdLon": 116.362488,
        "lat": 39.986149,
        "bdLat": 39.993275
    }, {
        "createTime": 1488340395000,
        "lon": 116.349706,
        "bdLon": 116.362498,
        "lat": 39.985999,
        "bdLat": 39.993125
    }, {
        "createTime": 1488340404000,
        "lon": 116.349754,
        "bdLon": 116.362546,
        "lat": 39.985904,
        "bdLat": 39.993031
    }, {
        "createTime": 1488340413000,
        "lon": 116.349893,
        "bdLon": 116.362684,
        "lat": 39.985931,
        "bdLat": 39.99306
    }, {
        "createTime": 1488340423000,
        "lon": 116.350072,
        "bdLon": 116.362863,
        "lat": 39.985952,
        "bdLat": 39.993084
    }, {
        "createTime": 1488340432000,
        "lon": 116.350215,
        "bdLon": 116.363005,
        "lat": 39.985988,
        "bdLat": 39.993122
    }, {
        "createTime": 1488340442000,
        "lon": 116.350339,
        "bdLon": 116.363129,
        "lat": 39.98598,
        "bdLat": 39.993116
    }, {
        "createTime": 1488340452000,
        "lon": 116.350509,
        "bdLon": 116.363299,
        "lat": 39.985974,
        "bdLat": 39.993113
    }, {
        "createTime": 1488340461000,
        "lon": 116.350671,
        "bdLon": 116.36346,
        "lat": 39.98597,
        "bdLat": 39.993111
    }, {
        "createTime": 1488340469000,
        "lon": 116.350842,
        "bdLon": 116.363631,
        "lat": 39.985985,
        "bdLat": 39.993129
    }, {
        "createTime": 1488340478000,
        "lon": 116.351011,
        "bdLon": 116.363799,
        "lat": 39.985978,
        "bdLat": 39.993125
    }, {
        "createTime": 1488340487000,
        "lon": 116.35117,
        "bdLon": 116.363958,
        "lat": 39.985969,
        "bdLat": 39.993118
    }, {
        "createTime": 1488340497000,
        "lon": 116.351358,
        "bdLon": 116.364145,
        "lat": 39.985973,
        "bdLat": 39.993125
    }, {
        "createTime": 1488340508000,
        "lon": 116.351562,
        "bdLon": 116.364348,
        "lat": 39.985989,
        "bdLat": 39.993144
    }, {
        "createTime": 1488340516000,
        "lon": 116.35173,
        "bdLon": 116.364516,
        "lat": 39.985999,
        "bdLat": 39.993157
    }, {
        "createTime": 1488340534000,
        "lon": 116.351788,
        "bdLon": 116.364574,
        "lat": 39.986173,
        "bdLat": 39.993332
    }, {
        "createTime": 1488340543000,
        "lon": 116.35178,
        "bdLon": 116.364566,
        "lat": 39.986318,
        "bdLat": 39.993477
    }, {
        "createTime": 1488340554000,
        "lon": 116.351756,
        "bdLon": 116.364542,
        "lat": 39.986415,
        "bdLat": 39.993574
    }, {
        "createTime": 1488340570000,
        "lon": 116.351639,
        "bdLon": 116.364425,
        "lat": 39.986574,
        "bdLat": 39.993731
    }, {
        "createTime": 1488340579000,
        "lon": 116.351638,
        "bdLon": 116.364424,
        "lat": 39.986729,
        "bdLat": 39.993886
    }, {
        "createTime": 1488340594000,
        "lon": 116.351707,
        "bdLon": 116.364493,
        "lat": 39.986896,
        "bdLat": 39.994054
    }, {
        "createTime": 1488340603000,
        "lon": 116.351747,
        "bdLon": 116.364533,
        "lat": 39.987027,
        "bdLat": 39.994186
    }, {
        "createTime": 1488340614000,
        "lon": 116.351792,
        "bdLon": 116.364578,
        "lat": 39.987179,
        "bdLat": 39.994338
    }, {
        "createTime": 1488340622000,
        "lon": 116.351838,
        "bdLon": 116.364624,
        "lat": 39.987303,
        "bdLat": 39.994463
    }]
}

var playerObj = {
    $close: $('.player_wrapper .btn_close'),
    $date: $('.player_wrapper .title .date'),
    $rangeNow: $('.player_wrapper .title .now '),
    $rangeEnd: $('.player_wrapper .title .end '),
    $speed: $('.player_wrapper .title .speed .item'),
    $btn_play: $('.player_wrapper .time_line .btn_play'),
    $time_mark: $('.player_wrapper .time_line .time_mark'),
    $stick_bar : $('.player_wrapper .time_line .stick_bar'),
    $move_bar: $('.player_wrapper .time_line .move_bar'),
    $active_bar: $('.player_wrapper .time_line .line_bar_active'), //蓝色进度条
    $time_now: $('.player_wrapper .time_line .time_now'),

    lineLength: $('.player_wrapper .time_line .line_bar').width(),
    timer: null, //定时器
    nowTime: 0, //播放的时间进度
    beginTime : null,
    endTime : null,
    allTime : null, //巡线总时长
    aData: null, //轨迹点
    lastPt: null, //上一个轨迹点
    nextPt: null, //下一个轨迹点
    rate: 30, //播放速度比率

    init: function () {
        var that = this;
        that.bindEvent();
    },
    bindEvent: function () {
        var that = this;
        that.$btn_play[0].onclick = function () {
            if ($(this).hasClass('active')) {
                if(that.nowTime >=  that.allTime){
                    that.nowTime = 0;
                }
                that.setTimer(true);
                return;
            }
            that.setTimer();
        };
        that.$speed.click(function(){
            var index = $(this).index();
            var aRate = [1,30,60,120,240];
            that.$speed.removeClass('active');
            $(this).addClass('active');
            that.rate = aRate[index-1];
        });
    },
    render: function () {
        var that = this;
        console.log(that.beginTime)
        var begin = new Date(that.beginTime).Format('yyyy.MM.dd');
        var end = new Date(that.endTime).Format('yyyy.MM.dd');
        var sDate = begin;
        if(end.slice(-2) !== begin.slice(-2)){
            var sDate = begin + ' - ' + end;
        }
        that.$date.html(sDate);


        that.renderStick();

    },
    renderStick : function(){
        var that = this;
        var begin_time = new Date(that.beginTime).Format('HH:mm:ss');
        var end_time = new Date(that.endTime).Format('HH:mm:ss');
        var s = '';
        var sTime = '<div class="time">'+ begin_time +'</div>';
        for(var i = 1; i < 6;i++){
            s+= '<div class="stick" style="left:'+ i/6*that.lineLength+'px"></div>';
            sTime += '<div class="time" style="left:'+ i/6*that.lineLength+'px">'+ new Date(that.beginTime+that.allTime*i/6).Format('HH:mm:ss') +'</div>';
        }
        sTime += '<div class="time" style="left:'+ i/6*that.lineLength+'px">'+ end_time +'</div>';
        console.log(that.lineLength);
        that.$stick_bar.html(s);
        that.$time_mark.html(sTime);
    },
    renderTimeLine : function(){
        var that = this;
        var rate = that.nowTime / that.allTime;
        that.$move_bar.css('left', rate*600);
        that.$active_bar.css('width', rate*600);
        that.$time_now.css('left', rate*600);
    },
    requestRoutePoint: function () {
        var that = this;
        setTimeout(function () {
            that.aData = data.rows;
            that.beginTime = that.aData[0].createTime;
            that.endTime = that.aData[that.aData.length - 1].createTime;
            that.allTime = that.endTime - that.beginTime;
            that.render();
            that.drawRoute(that.aData);
            that.movePerson(that.aData);
        }, 200);
    },
    play: function () {
        var that = this;
        that.requestRoutePoint();
    },
    drawRoute: function (data) {
        var obj = mapObj.getMaxPointAndMinPoint(data);
        var level = mapObj.getCenterPointAndZoomLevel(obj.maxLon, obj.maxLat, obj.minLon, obj.minLat);
        map.centerAndZoom(level.centerPoint, level.zoomlevel);
        var arr = data.map(function (item, index, arr) {
            return new BMap.Point(item.bdLon, item.bdLat);
        });
        var polyline = new BMap.Polyline(arr, {
            strokeColor: "#59b6fc",
            strokeWeight: 4,
            strokeOpacity: 1,
        });
        var startMarker = new BMap.Marker(new BMap.Point(data[0].bdLon, data[0].bdLat), {
            icon: new BMap.Icon("/src/images/map/icon_start.png", new BMap.Size(30, 42), { //小车图片
                anchor: new BMap.Size(15, 42), //图标的定位锚点
            })
        });
        var endMarker = new BMap.Marker(new BMap.Point(data[data.length - 1].bdLon, data[data.length - 1].bdLat), {
            icon: new BMap.Icon("/src/images/map/icon_end.png", new BMap.Size(30, 42), { //小车图片
                anchor: new BMap.Size(15, 42), //图标的定位锚点
            })
        });
        map.addOverlay(startMarker);
        map.addOverlay(endMarker);
        map.addOverlay(polyline);
    },
    movePerson: function (data) {
        var that = this;
        that.personMarker = new BMap.Marker(new BMap.Point(data[0].bdLon, data[0].bdLat), {
            icon: new BMap.Icon("/src/images/map/icon_person.png", new BMap.Size(30, 42))
        });
        map.addOverlay(that.personMarker);
        //console.log(data[0])
        that.setTimer(true);
    },
    setTimer: function (bool) {
        /*
         ** 传入true，开启定时器
         ** 不传或false，关闭定时器
         */
        var that = this;
        var data = that.aData;
        if (that.timer ) {
            that.$btn_play.addClass('active');
            clearInterval(that.timer);
        }
        if( that.nowTime > that.allTime || !bool ){
            return;
        }
        that.$btn_play.removeClass('active');
        that.timer = setInterval(function () {
            that.nowTime += 40 * that.rate;
            if (that.nowTime > that.allTime) {
                that.$btn_play.addClass('active');
                clearInterval(that.timer);
            }
            that.setCurrentPointByTime(data[0].createTime + that.nowTime);
            that.renderTimeLine();
        }, 40);
    },
    setCurrentScopeByTime: function (time) {
        var that = this;
        var a = that.aData;
        var l = a.length;
        for (var i = 0; i < l; i++) {
            if (time < a[i].createTime) {
                that.lastPt = a[i - 1];
                that.nextPt = a[i];
                return;
            }
        }
        that.lastPt = a[l - 1];
        that.nextPt = null;
    },
    setCurrentPointByTime: function (time) {
        var that = this;
        that.setCurrentScopeByTime(time);
        if (!that.nextPt) {
            return;
        }
        var time_now = time - that.lastPt.createTime;
        var time_all = that.nextPt.createTime - that.lastPt.createTime;
        var rate = time_now / time_all;
        var lat = that.lastPt.bdLat + (that.nextPt.bdLat - that.lastPt.bdLat) * rate;
        var lon = that.lastPt.bdLon + (that.nextPt.bdLon - that.lastPt.bdLon) * rate;
        that.personMarker.setPosition(new BMap.Point(lon, lat));
    }
};
playerObj.init();
playerObj.play();