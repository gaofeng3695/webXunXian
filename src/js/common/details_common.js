$(function() {
    detailsObj.init(); //初始化-事件详情
});


//查看事件详情
var detailsObj = {
    $detailsMap: new BMap.Map("details_address_map"),
    init: function() {
        var _this = this;
        // debugger;
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
    },
    setCenterZoom: function(msg) { //设置中心点
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
        var marker = new BMap.Marker(point, {
            icon: myIcon
        });
        this.$detailsMap.addOverlay(marker);
        this.$detailsMap.centerAndZoom(point, 15);
    },
    loadEventDetails: function(eventId) { //加载事件详情
        var _this = this;
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

                var pic_scr = "";
                for (var i = 0; i < images.length; i++) {
                    pic_scr += '<div class="event_pic_list">' +
                        '<img  src="/cloudlink-core-file/file/getImageBySize?fileId=' + images[i] + '&viewModel=fill&width=104&hight=78" id="imagesPic' + i + '" onclick="previewPicture(this)" alt=""/>' +
                        '</div>';
                }
                $(".event_pic").append(pic_scr);

                if (msg[0].audio.length == 0) {
                    $(".event_audio").html("无");
                } else {
                    var audioMain = '<button  class="audioPlay" onclick="playAmrAudio(\'' + msg[0].audio[0] + '\',this)"></button>';
                    $(".event_audio").html(audioMain);
                }
                //打开地图中心点
                _this.setCenterZoom(msg);
            }
        });
    }
}

//录音文件的播放
function playAmrAudio(_fileId, e) {
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