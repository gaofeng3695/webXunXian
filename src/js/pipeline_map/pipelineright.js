var pipe_right_title = { //左侧title组件
    template: '#pipe-right-title',
    methods: {
        tabchange: function(sTap, bgcolor) {
            this.$emit('tabchange', sTap);
            // console.log(e.currentTarget)
            $(bgcolor.currentTarget).attr("class", "active").siblings('li').attr("class", "");
        }
    },
};

var pipe_right_content_attribute = { //左侧属性组件
    // props: {
    //     detail: {
    //         type: Object
    //     },
    // },
    props: ["detail"],
    data: function() {
        return {};
    },
    template: '#pipe-right-content-attribute',
    mounted: function() {

    },
    methods: {
        is_change_value: function(e) {
            var name = $(e.currentTarget).attr("name");
            var val = this.detail[name];
            var valN = $(e.currentTarget).val().trim();
            if (valN != val) {
                $(".attributeBtn").addClass("btnBgcolor");
            } else {
                $(".attributeBtn").removeClass("btnBgcolor");
            }
        },
        save_attribute: function(e) {
            if ($(e.currentTarget).hasClass("btnBgcolor")) {
                this.$emit('attributeedit', "item1");
            }
        }
    },
};

var pipe_right_content_style = { //左侧样式组件
    template: '#pipe-right-content-style',
    props: ["detailstyle"],
    data: function() {
        return {};
    },
    watch: {
        detailstyle: function() {
            if (this.detailstyle.pipeStyle == "solid") {
                $('select').val("1")
            } else if ((this.detailstyle.pipeStyle == "dashed")) {
                $('select').val("2");
            }
            $(".bgColorStyle").css("background-color", this.detailstyle.pipeColor);
            $(".borderColorStyle").css("border-color", this.detailstyle.pipeColor);
            $(".borderColorStyle").css("border-style", this.detailstyle.pipeStyle);
            $(".preview").css({ "height": this.detailstyle.pipeWeight, "background-color": this.detailstyle.pipeColor });
            $(".scale div").css({ "width": (this.detailstyle.pipeWeight) * 6, "background-color": this.detailstyle.pipeColor });
            $("#btn").css("left", (this.detailstyle.pipeWeight) * 6);
            console.log(this.detailstyle);
        }
    },
    mounted: function() {
        //边线颜色的设置
        $('.bgcolor').bigColorpicker(function(el, color) {
            $(".bgColorStyle").css("background-color", color);
            $(".borderColorStyle").css("border-color", color);
            $(".scale div").css("background-color", color);
            $(".preview").css("background-color", color);
        });
        //边线样式的设置
        $(".chooseStyle").click(function() {
            var val = $('select').val();
            if (val == 1) {
                $(".borderColorStyle").css("border-style", "solid");
            } else {
                $(".borderColorStyle").css("border-style", "dashed");
            }
        });
        //进度条插件
        var scale = function(btn, bar) {
            this.btn = document.getElementById(btn);
            this.bar = document.getElementById(bar);
            this.fontSizeVal = document.getElementById("font_size");
            this.step = this.bar.getElementsByTagName("div")[0];
            this.init();
        };
        scale.prototype = {
            init: function() {
                var f = this,
                    g = document,
                    b = window,
                    m = Math;
                f.btn.onmousedown = function(e) {
                    var x = (e || b.event).clientX;
                    var l = this.offsetLeft;
                    var max = f.bar.offsetWidth - this.offsetWidth;
                    g.onmousemove = function(e) {
                        var thisX = (e || b.event).clientX;
                        var to = m.min(max, m.max(-2, l + (thisX - x)));
                        f.btn.style.left = to + 'px';
                        f.ondrag(m.round(m.max(0, to / max) * 100), to);
                        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                    };
                    g.onmouseup = new Function('this.onmousemove=null');
                };
            },
            ondrag: function(pos, x) {
                this.step.style.width = Math.max(0, x) + 'px';
                var num = (pos - pos % 5.26) / 5.26 + 1;
                this.fontSizeVal.value = Math.round(num);
                //拖拽进度条 效果预览跟随改变

                $(".preview").height(num);
            }
        }
        new scale('btn', 'bar');
        //价格输入验证 正整数
        $('#font_size').on('input proprarychange', function(h) {
            var val = $(this).val().trim();
            var length = val.length;
            var reg = /[\D]/g;
            if (reg.test(val) || val > 20) {
                $(this).val(val.substring(0, length - 1))
                return;
            } else if (val == 0) {
                $(this).val("1")
                val = 1;
            }
            $('.scale>div').width(val * 6);
            $('#btn').attr('style', 'left:' + val * 6 + 'px');
            //改变input值 效果预览宽度跟随改变
            if (val == "" || val == null) {
                $(".preview").height(0);
            } else {
                $(".preview").height(val);
            }

        })
    },
    methods: {
        save_style: function(e) {
            if ($(e.currentTarget).hasClass("btnBgcolor")) {
                this.$emit('styleedit', "item2");
            }
        }
    },
};

var pipe_right_content_point = { //左侧坐标点组件
    template: '#pipe-right-content-point',
    props: ["detailPointer"],
    data: function() {
        return {};
    },
    methods: {
        deletePointer: function(index) {
            var that = this;
            var defaultOptions = {
                tip: '是否确定删除坐标点？',
                name_title: '提示',
                name_cancel: '取消',
                name_confirm: '确定',
                isCancelBtnShow: true,
                callBack: function() {
                    var arr = that.detailPointer.line;
                    console.log(arr)
                    arr.splice(index, 1)
                    Vue.set(that.detailPointer, "line", arr);
                    that.$emit("pointedit", 'item3');
                }
            };
            xxwsWindowObj.xxwsAlert(defaultOptions);
        }
    },
};

var pipenetwork_attribute = {
    props: {
        details: {
            type: [Object, String]
        },
    },
    template: '#pipenetwork-attribute',

    methods: {
        //点击关闭右侧管网编辑属性
        closefunction: function() {
            $(".pipenetworkEdit").hide();
        },
    },
    watch: {
        pipeNetworkName: function() {
            console.log("ddddd");
        }
    }
};
//管线详细信息
var pipeline_edit = {
    props: {
        linedetail: {
            type: [Object, String],
        },
        netdetail: {
            type: [Object, String],
        },
    },
    template: '#pipeline_edit',
    components: {
        'pipe-right-title': pipe_right_title,
        'pipe-right-content-attribute': pipe_right_content_attribute,
        'pipe-right-content-style': pipe_right_content_style,
        'pipe-right-content-point': pipe_right_content_point,
        'pipenetwork-attribute': pipenetwork_attribute
    },
    data: function() {
        return {
            sCurrentTap: 'attributeShow',
        };
    },
    methods: {
        tabchange: function(sTap) {
            this.sCurrentTap = sTap;
        },
        //点击关闭右侧管线编辑属性
        pipeNeLineClose: function() {
            this.$emit('checkedcloseline');
        },
        //点击关闭右侧管网编辑属性
        pipeNetworkClose: function() {
            this.$emit('chooseclosenet');
        },
        //管线修改提交
        lineModify: function(e) {
            var obj = this.linedetail;
            $.ajax({
                type: "POST",
                url: "/cloudlink-inspection-event/commonData/pipemapline/update?token=" + lsObj.getLocalStorage('token'),
                contentType: "application/json",
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(data) {
                    if (data.success == 1) {
                        if (e == "item1") {
                            xxwsWindowObj.xxwsAlert("修改管线属性成功", function() {
                                //此处调用方法，进行坐标点列表刷新
                            });
                        } else if (e == "item3") {
                            xxwsWindowObj.xxwsAlert("删除坐标点成功", function() {
                                //此处调用方法，进行坐标点列表刷新
                            });
                        } else {
                            xxwsWindowObj.xxwsAlert("修改管线样式成功", function() {
                                //此处调用方法，进行坐标点列表刷新
                            });
                        }
                    } else {
                        xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                    }
                }
            });
        }

    },
};