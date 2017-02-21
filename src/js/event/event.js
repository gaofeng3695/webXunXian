// 筛选选择
$(".main_list").each(function() {
    $(this).find("span").click(function() {
        $(this).attr("class", "active").siblings("span").attr("class", "");
        var index = $('.status_nav').find('.active').index();
        var status = $(".status_relation2").find('.active').index();
        $(".status_relation1 label").eq(status).addClass("active").siblings("label").removeClass("active");
        if (index == 0) {
            $(".status_list").hide();
        } else {
            $(".status_list").show();
            $(".status_list li").eq(index - 1).show().siblings("li").hide();
        }
    })
});

// 状态的联动

$(".status_relation1 label").each(function(e) {
    $(this).click(function() {
        $(".status_relation2 span").eq(e).attr("class", "active").siblings("span").attr("class", "")
    })
})

// 打开高级搜索

var conditionObj = {
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
conditionObj.init();


//新建事件
var eventObj = {
    $addBtn: $("#btn_add"),
    $submit: $(".submit"),
    $mapA: $(".map_address"),
    $lng: $("input[name=lng]"),
    $lat: $("input[name=lat]"),
    $eventM: $("#addEvent"),
    $mapM: $("#event_address"),
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
    },
    eventOpen: function() { //打开摸态窗口
        this.$eventM.modal();
    },
    mapOpen: function() { //打开地图摸态窗口
        this.$mapM.modal();
        this.iconHide();
    },
    submit: function() { //提交表单
        this.$modal.modal('hide');
    },
    iconHide: function() { //隐藏百度图标与文字
        $(".BMap_cpyCtrl.BMap_noprint.anchorBL,.anchorBL").hide();
        $(".anchorBL a").hide();
    }
}


$(document).ready(function() {
    // 通过该方法来为每次弹出的模态框设置最新的zIndex值，从而使最新的modal显示在最前面
    $(document).on('show.bs.modal', '.modal', function(event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
});


$("#export_choice").click(function() {
    // 获取已选的信息
    var tex = $('#table').bootstrapTable('getSelections');
    mapObj.upload(tex);
    // console.log(JSON.stringify(tex));
})





// 地图的显示隐藏

var mapObj = {
    $mapBtn: $(".bottom_btn span"),
    $mapO: $("#event_map"),
    $mapEvent: new BMap.Map("event_map"), // 创建Map实例
    init: function() {
        var _this = this;
        //百度地图API功能
        //加载第一张地图
        var point = new BMap.Point(116.404, 38.915);
        this.$mapEvent.centerAndZoom(point, 12);
        this.$mapEvent.enableScrollWheelZoom(); //启用滚轮放大缩小

        var top_right_navigation = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_SMALL
        }); //右上角，仅包含平移和缩放按钮
        this.$mapEvent.addControl(top_right_navigation);
        // var geolocation = new BMap.Geolocation();
        // geolocation.getCurrentPosition(function(r) {
        //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        //         var myIcon = new BMap.Icon("/src/images/event/personal.png", new BMap.Size(130, 130));
        //         var mk = new BMap.Marker(r.point, {
        //             icon: myIcon
        //         });
        //         _this.$mapEvent.addOverlay(mk);
        //         // _this.$mapEvent.panTo(r.point); //中心点跳转
        //         // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
        //     } else {
        //         alert('failed' + this.getStatus());
        //     }
        // }, {
        //     enableHighAccuracy: true
        // });
        // console.log(dataAll);
        // mapObj.Upload(dataAll);
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
        eventObj.iconHide();
    },
    setMark: function(data) {
        var myIcons = null;
        var markers = null;
        var point = null;
        var label = null;
        for (var i = 0; i < data.length; i++) {
            point = new BMap.Point(data[i].bdLon, data[i].bdLat);
            label = new BMap.Label("" + data[i].objectId, { offset: new BMap.Size(20, -10) });
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
        }
    },
    upload: function(data) { //加载事件标注点
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
            if (allOverlay[i].getLabel().content == data.objectId) {
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
    }
};




var mapAddObj = { //上报事件地图
    $map: new BMap.Map("address_map"), // 创建Map实例
    $text: $("input[name=map_address]"),
    $dataPass: $(".dataPass"),
    $val: $(".search_val"),
    $botton: $(".search_botton"),
    $lng: null,
    $lat: null,
    $marker: null,
    $point: null,
    $address: new BMap.Geocoder(),
    init: function() {
        var _this = this;
        this.$lng = 116.404;
        this.$lat = 38.915;
        this.$point = new BMap.Point(this.$lng, this.$lat);
        this.$map.centerAndZoom(this.$point, 15);
        this.$map.enableScrollWheelZoom(); //启用滚轮放大缩小
        this.$map.addEventListener("click", function(e) {
            _this.$lng = e.point.lng;
            _this.$lat = e.point.lat;
            _this.remove();
            _this.add();
        });
        this.$botton.click(function() {
            var local = new BMap.LocalSearch(_this.$map, {
                renderOptions: { map: _this.$map }
            });
            local.search(_this.$val.val().trim());
        });
        this.$dataPass.click(function() {
            if (_this.$text.val() == '') {
                alert("请选择地理位置！")
            } else {
                eventObj.$mapA.val(_this.$text.val()); //传地址过去
                eventObj.$lng.val(_this.$lng);
                eventObj.$lat.val(_this.$lat);
                eventObj.$mapM.modal('hide');
            }
        })
    },
    add: function() {
        this.$point = new BMap.Point(this.$lng, this.$lat);
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
// 单选框
$(".pay_list_c1").each(function(e) {
    $(this).click(function() {
        $(".pay_list_c1").removeClass("on");
        $(this).addClass("on");
        $(this).find("input[type='radio']").prop("checked", true);
    })
});





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



$(function() {
    eventObj.init(); //事件上报
    mapObj.init(); //页面地图
    mapAddObj.init(); //事件地图
    // detailsMapObj.init();
    initTable(); //初始化表格数据

    $("button[type=submit]").click(function() {
        // alert(JSON.stringify(dataAll));
        // mapObj.Upload(dataAll);
        // $('#table').bootstrapTable('load');
    })
});


function initTable() {
    $('#table').bootstrapTable({
        url: "/cloudlink-inspection-event/eventInfo/web/v1/getPageList?token=b7b9fc32-1593-4b14-ba05-f1eb623e17b8", //请求数据url
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
                startDate: "",
                endDate: "",
                status: "20,21,30"
            };
        },
        responseHandler: function(res) {

            var dataAll = res.rows; //初始化的数据
            mapObj.upload(dataAll);
            // alert(JSON.stringify(dataAll));
            return res;
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
            title: '事件时间', //标题
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
            field: 'status', //域值
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
// 表格里面的操作
window.operateEvents = {
    //定位功能
    'click .location': function(e, value, row, index) {
        if ($(this).find('i').attr("class") == 'active') {} else {
            $(".location").find('i').attr("class", "");
            $(this).find('i').attr("class", "active");
            mapObj.getMark(row);
        }

        return false;
    },
    //查看详情
    'click .check': function(e, value, row, index) {
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