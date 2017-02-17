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
// $(".btn_search").click(function() {
//     $(".nav_main").toggle("slow");
// })

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
// $("#btn_add").click(function() {
//     alert("dd")
//     $.ajax({
//         type: "POST",
//         url: "event.json",
//         dataType: 'JSON',
//         success: function(data) {
//             if (data.result != 0) {
//                 toastr.info("info", data.message);
//                 return;
//             }
//             toastr.success("success", '标签');
//             $("#table").bootstrapTable('insertRow', {
//                 index: 0,
//                 row: data.data
//             });
//         }
//     });

// });

var eventObj = {
    $addBtn: $("#btn_add"),
    $submit: $(".submit"),
    init: function() {
        var _this = this;
        this.$addBtn.click(function() {
            _this.open();
        });
        this.$submit.click(function() {
            _this.submit();
        });
    },
    open: function() { //打开摸态窗口
        $("#addEvent").modal();
    },
    submit: function() { //提交表单
        $('#addEvent').modal('hide')
    }
}
eventObj.init();


$("#export_choice").click(function() {
    getSelect();
})


// 获取已选的信息
function getSelect() {
    var tex = $('#table').bootstrapTable('getSelections');
    console.log(JSON.stringify(tex));
}






// 地图的显示隐藏
// $(".bottom_btn span").click(function() {
//     if ($(this).attr("class") == "map_up") {
//         $(this).attr("class", "map_down");
//         $("#event_map").slideUp();
//     } else {
//         $(this).attr("class", "map_up");
//         $("#event_map").slideDown();
//     }
// })

var mapObj = {
    $mapBtn: $(".bottom_btn span"),
    $map: $("#event_map"),
    init: function() {
        var _this = this;
        this.$mapBtn.click(function() {
            _this.control();
        });
    },
    control: function() {
        if (this.$map.is(":hidden")) {
            this.show();
        } else {
            this.hide();
        }
    },
    hide: function() {
        this.$map.slideUp();
        this.$mapBtn.attr("class", "map_down");
    },
    show: function() {
        this.$map.slideDown();
        this.$mapBtn.attr("class", "map_up");
    }
};
mapObj.init();