var pipe_right_title = { //右侧title组件
    template: '#pipe-right-title',
    methods: {
        tabchange: function(sTap, bgcolor) {
            this.$emit('tabchange', sTap);
            $(bgcolor.currentTarget).attr("class", "active").siblings('li').attr("class", "");
        }
    },
};

var pipe_right_content_attribute = { //右侧属性组件
    props: ["detail"],
    data: function() {
        return {
            changeArr: []
        }
    },
    template: '#pipe-right-content-attribute',
    methods: {
        is_change_value: function(e) {
            var name = $(e.currentTarget).attr("name");
            var val = this.detail[name];
            var valN = $(e.currentTarget).val().trim();
            if (valN != val) {
                var arr = this.changeArr;
                arr.push({ "name": name, "value": valN });
                this.changeArr = arr;
            }
        },
        save_attribute: function(e) {
            if ($(e.currentTarget).html() == "修改") {
                $(e.currentTarget).html("保存")
                $(".right-content-attribute input").prop({ disabled: false });
                $(".right-content-attribute textarea").prop({ disabled: false });
            } else {
                for (var i = 0; i < this.changeArr.length; i++) {
                    Vue.set(this.detail, this.changeArr[i].name, this.changeArr[i].value);
                }
                this.$emit('attributeedit', this.detail);
            }
        },
    },
};

var pipe_right_content_style = { //右侧样式组件
    template: '#pipe-right-content-style',
    props: ["detailstyle"],
    data: function() {
        return {
            lineWeight: {},
            lineColor: {},
            lineStyle: {}
        }
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
            if (this.detailstyle.pipeWeight == "" || this.detailstyle.pipeWeight == null) {
                this.detailstyle.pipeWeight = "2"
                $(".preview").height("2px");
                $(".scale div").css({ "width": "12px", "background-color": this.detailstyle.pipeColor });
                $("#btn").css("left", "12px");
            } else {
                $(".scale div").css({ "width": (this.detailstyle.pipeWeight) * 6, "background-color": this.detailstyle.pipeColor });
                $("#btn").css("left", (this.detailstyle.pipeWeight) * 6);
            }
        }
    },
    mounted: function() {
        var that = this;
        //边线颜色的设置
        $('.bgcolor').bigColorpicker(function(el, color) {
            $(".bgColorStyle").css("background-color", color);
            $(".borderColorStyle").css("border-color", color);
            $(".scale div").css("background-color", color);
            $(".preview").css("background-color", color);
            that.lineColor.pipeColor = color; ////储存改变后线颜色的值
            //上传that.lineColor
            console.log(that.lineColor);
            // that.$emit("styleedit", that.lineColor);
        });
        //边线样式的设置
        $(".chooseStyle").click(function() {
            var val = $('select').val();
            if (val == 1) {
                $(".borderColorStyle").css("border-style", "solid");
                that.lineStyle.pipeStyle = "solid"; //储存改变后线类型的值
            } else {
                $(".borderColorStyle").css("border-style", "dashed");
                that.lineStyle.pipeStyle = "dashed"; //储存改变后线类型的值
            }
            //上传that.lineStyle
            console.log(that.lineStyle);
            //that.$emit("styleedit", that.lineStyle);
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
                that.lineWeight.pipeWeight = num; //储存改变后线宽的值
                //上传that.lineWeight
                console.log(that.lineWeight);
                // that.$emit("styleedit", that.lineWeight);
            }
        };
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
            that.lineWeight.pipeWeight = val; //储存改变后线宽的值
            console.log(that.lineWeight)
                //上传that.lineWeight
                //that.$emit("styleedit", that.lineWeight);
        })
    }
};


var pipe_right_content_point = { //右侧坐标点组件
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
                    arr.splice(index, 1)
                    Vue.set(that.detailPointer, "line", arr);
                    //把修改的坐标点传给父组件
                    console.log(that.detailPointer.line);
                    //that.$emit("pointedit", that.detailPointer.line);
                }
            };
            xxwsWindowObj.xxwsAlert(defaultOptions);
        },
        click1: function() {
            this.$emit("click1");
        }
    },
};
var pipenetwork_attribute = { //右侧管网属性组件
    props: {
        details: {
            type: [Object, String]
        },
    },
    data: function() {
        return {
            changeArr: []
        }
    },
    template: '#pipenetwork-attribute',
    methods: {
        is_change: function(e) {
            var name = $(e.currentTarget).attr("name");
            var val = this.details[name];
            var valN = $(e.currentTarget).val().trim();
            if (valN != val) {
                var arr = this.changeArr;
                arr.push({ "name": name, "value": valN });
                this.changeArr = arr;
            }
        },
        save_workattribute: function(e) {
            if ($(e.currentTarget).html() == "修改") {
                $(e.currentTarget).html("保存")
                $(".pipenetwork-attribute input").prop({ disabled: false });
                $(".pipenetwork-attribute textarea").prop({ disabled: false });
            } else {
                for (var i = 0; i < this.changeArr.length; i++) {
                    Vue.set(this.details, this.changeArr[i].name, this.changeArr[i].value);
                }
                this.$emit('workattributeedit', this.details);
                this.$emit('savework', this.details.objectId);
            }
        },
    },
};
var importpointermodal = { //导入坐标点模态框
    template: '#importpointermodal',
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
        'pipenetwork-attribute': pipenetwork_attribute,
        'importpointermodal': importpointermodal
    },
    data: function() {
        return {
            sCurrentTap: 'attributeShow',
            show: false,
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
        shrink: function(e) {
            // if($(e.currentTarget).html()=="∨"){
            //     $(e.currentTarget).html("∧");


            // }else{
            //     $(e.currentTarget).html("")
            // }
        },
        click1: function() {
            this.styleobj = {
                title: "12",
                width: "600",
                height: "400",
            };
            this.aFooters = [{ "title": "新建", "color": "#59b6fc", "disabled": false }];
            this.show = true;
        },
        cancel: function() {
            this.show = false;
        },
        //管线修改提交
        lineModify: function(data) {
            var that = this;
            var _data = {
                "objectId": data.objectId, //管线主键ID
                "pipeNetworkId": data.pipeNetworkId, //所属管网主键
                "pipeLineName": data.pipeLineName, //管线名称
                "pipeLineRemark": data.pipeLineRemark, //备注
                "pipeMaterial": data.pipeMaterial, //材质
                "pipeDiameter": data.pipeDiameter, //管径
                "pipeThickness": data.pipeThickness, //壁厚
                "pipeLength": data.pipeLength, //管线长度（划线的测量长度）
                "pipeFactLength": data.pipeFactLength, //管线实际长度（人工输入的长度）
                "pipeColor": data.pipeColor, //管线颜色
                "pipeStyle": data.pipeStyle, //设置是为实线或虚线 (solid或dashed)
                "pipeWeight": data.pipeWeight, //管线宽度（1~20）
            };
            //if (that.verifyPipe()) {
            $.ajax({
                type: "POST",
                url: "/cloudlink-inspection-event/pipemapline/updateProperty?token=" + lsObj.getLocalStorage('token'),
                contentType: "application/json",
                data: JSON.stringify(_data),
                dataType: "json",
                success: function(data) {
                    if (data.success == 1) {
                        xxwsWindowObj.xxwsAlert("修改管线属性成功", function() {
                            that.$emit('saveline', data.objectId, 3);
                            $(".attributeBtn").html("修改");
                            $(".right-content-attribute  input").prop({ disabled: true });
                            $(".right-content-attribute  textarea").prop({ disabled: true });
                        });
                    } else {
                        $(".attributeBtn").html("修改");
                        $(".right-content-attribute  input").prop({ disabled: true });
                        $(".right-content-attribute  textarea").prop({ disabled: true });
                        xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                    }
                },
                error: function() {
                    $(".attributeBtn").html("修改");
                    $(".right-content-attribute  input").prop({ disabled: true });
                    $(".right-content-attribute  textarea").prop({ disabled: true });
                    xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                }
            });
            // }
        },
        //管网修改提交
        worklineModify: function(data) {
            console.log(data)
            var that = this;
            //if (that.verifyNet()) {
            var _data = {
                "objectId": data.objectId,
                "pipeNetworkName": data.pipeNetworkName,
                "pipeNetworkRemark": data.pipeNetworkRemark,
                "pipeNetworkUsed": data.pipeNetworkUsed
            };
            $.ajax({
                type: "POST",
                url: "/cloudlink-inspection-event/commonData/pipemapnetwork/update?token=" + lsObj.getLocalStorage('token'),
                contentType: "application/json",
                data: JSON.stringify(_data),
                dataType: "json",
                success: function(data) {
                    if (data.success == 1) {
                        console.log(_data.pipeNetworkName)
                        xxwsWindowObj.xxwsAlert("修改管网属性成功", function() {
                            that.$emit('savework', _data.objectId);
                            $(".attributeWorkBtn").html("修改");
                            $(".pipenetwork-attribute input").prop({ disabled: true });
                            $(".pipenetwork-attribute textarea").prop({ disabled: true });
                            //此处调用方法，进行坐标点列表刷新
                        });
                    } else {
                        $(".attributeWorkBtn").html("修改");
                        $(".pipenetwork-attribute input").prop({ disabled: true });
                        $(".pipenetwork-attribute textarea").prop({ disabled: true });
                        xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                    }
                },
                error: function() {
                    $(".attributeWorkBtn").html("修改");
                    $(".pipenetwork-attribute input").prop({ disabled: true });
                    $(".pipenetwork-attribute textarea").prop({ disabled: true });
                    xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                }
            });
            //}
        },
        //管线编辑长度验证
        verifyNet: function() {
            //进行填报管网验证
            if (this.netdetail.pipeNetworkName.trim().length == 0) {
                xxwsWindowObj.xxwsAlert("管网名称不能为空");
                return false;
            }
            if (this.netdetail.pipeNetworkName.trim().length > 50) {
                xxwsWindowObj.xxwsAlert("管网名称长度不能超过50个字");
                return false;
            }
            if (this.netdetail.pipeNetworkRemark.trim().length > 201) {
                xxwsWindowObj.xxwsAlert("管网备注不能超过200个字");
                return false;
            }
            return true;
        },
        //管网编辑长度验证
        verifyPipe: function() {
            if (this.linedetail.pipeLineName.trim().length == 0) {
                xxwsWindowObj.xxwsAlert("管线名称不能为空");
                return false;
            }
            if (this.linedetail.pipeLineName.trim().length > 50) {
                xxwsWindowObj.xxwsAlert("管线名称长度不能超过50个字");
                return false;
            }
            if (this.linedetail.pipeMaterial.trim().length > 50) {
                //针对材质写正则
                xxwsWindowObj.xxwsAlert("管线材质长度不能超过50个字");
                return false;
            }
            if (this.linedetail.pipeDiameter.trim().length > 50) {
                //针对管径写正则
                xxwsWindowObj.xxwsAlert("管线管径长度不能超过50个字");
                return false;
            }
            if (this.linedetail.pipeThickness.trim().length > 50) {
                //针对壁厚写正则
                xxwsWindowObj.xxwsAlert("管线壁厚长度不能超过50个字");
                return false;
            }
            if (this.linedetail.pipeLength.trim().length > 0) {
                //针对管线长度写正则
                var flag = true;
                var regNum = /^[0-9]{1,1}\d{0,8}(\.\d{1,2})?$/;
                if (!regNum.test(this.inputobj.pipeLength.trim())) {
                    xxwsWindowObj.xxwsAlert("管线长度格式错误");
                    flag = false;
                }
                return flag;
            }
            if (this.linedetail.pipeLineRemark.trim().length > 201) {
                //针对管线备注写正则
                xxwsWindowObj.xxwsAlert("管线备注长度不能超过200个字");
                return false;
            }
            return true;
        },
    },
};