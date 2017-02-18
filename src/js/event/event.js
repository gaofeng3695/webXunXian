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
    mapOpen: function() { //打开摸态窗口
        this.$mapM.modal();
    },
    submit: function() { //提交表单
        this.$modal.modal('hide');
    }
}
eventObj.init();

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
    getSelect();
})


// 获取已选的信息
function getSelect() {
    var tex = $('#table').bootstrapTable('getSelections');
    console.log(JSON.stringify(tex));
}






// 地图的显示隐藏

var mapObj = {
    $mapBtn: $(".bottom_btn span"),
    $mapO: $("#event_map"),
    $mapEvent: new BMap.Map("event_map"), // 创建Map实例
    init: function() {
        var _this = this;
        //百度地图API功能
        //加载第一张地图
        var point1 = new BMap.Point(116.404, 38.915);
        this.$mapEvent.centerAndZoom(point1, 15);
        this.$mapEvent.enableScrollWheelZoom(); //启用滚轮放大缩小

        var top_right_navigation = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_SMALL
        }); //右上角，仅包含平移和缩放按钮
        this.$mapEvent.addControl(top_right_navigation);
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var myIcon = new BMap.Icon("/src/images/event/personal.png", new BMap.Size(130, 130));
                var mk = new BMap.Marker(r.point, {
                    icon: myIcon
                });
                _this.$mapEvent.addOverlay(mk);
                _this.$mapEvent.panTo(r.point);
                // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
            } else {
                alert('failed' + this.getStatus());
            }
        }, {
            enableHighAccuracy: true
        })


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
    }
};
mapObj.init();

var mapAddObj = {
    $map: new BMap.Map("address_map"), // 创建Map实例
    $text: $("input[name=map_address]"),
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
        this.$map.removeOverlay(this.$marker);
    }
}
mapAddObj.init();


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