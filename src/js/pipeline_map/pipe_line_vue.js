var pipe_left_top = { //局部组件的命名使用下划线连接的形式
    props: {
        title: {
            type: String,
        }
    },
    template: '#pipe_left_top',
    methods: {
        click1: function() {
            this.$emit('createinfo');
        }
    },

};
var pipe_line_list = {
    props: {
        pointerdatas: {
            type: Array,
        },
        currentnetname: {
            type: String,
        },
        slineid: {
            type: String,
        }
    },
    template: '#pipe_line_list',
    components: {
        'pipe-left-top': pipe_left_top,
    },
    methods: {
        deleteLine: function(item) {
            $.ajax({
                type: "POST",
                url: "/cloudlink-inspection-event/commonData/pipemapnetline/delete?token=" + lsObj.getLocalStorage('token'),
                contentType: "application/json",
                data: JSON.stringify({ "objectId": item.objectId }),
                dataType: "json",
                success: function(data) {
                    if (data.success == 1) {
                        /*此处针对BO进行重新存储*/
                        xxwsWindowObj.xxwsAlert("删除成功", function() {
                            //此处调用父级方法，进行列表刷新
                        });
                    } else {
                        xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                    }
                }
            });
        },
        clickLi: function(item) {
            this.$emit('checkedline', item.objectId);
        },
        createinfo: function() {
            var styleobj = {
                title: '新增管线',
                width: '800',
                height: '500',
            };
            var inputobj = {
                "pipeLineName": "",
                "pipeMaterial": "",
                "pipeDiameter": "",
                "pipeThickness": "",
                "pipeLength": "",
                "pipeLineRemark": "",
            };
            this.$emit('createinfo', styleobj, inputobj);
        },
        back: function() {
            this.$emit('changelist');
            this.$emit('checkedline', '');
        }
    },
}


var pipe_net_list = {
    props: {
        pipenetdatas: {
            type: Array,
        },
        startuserpipe: {
            type: Array,
        },
        snetid: {
            type: String
        }
    },

    template: '#pipe_net_list',
    components: {
        'pipe-left-top': pipe_left_top,
    },
    methods: {
        deleteNet: function(item) {
            $.ajax({
                type: "POST",
                url: "/cloudlink-inspection-event/commonData/pipemapnetwork/delete?token=" + lsObj.getLocalStorage('token'),
                contentType: "application/json",
                data: JSON.stringify({ "objectId": item.objectId }),
                dataType: "json",
                success: function(data) {
                    if (data.success == 1) {
                        /*此处针对BO进行重新存储*/
                        xxwsWindowObj.xxwsAlert("删除成功", function() {
                            //此处调用父级方法，进行列表刷新
                        });
                    } else {
                        xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                    }
                }
            });
        },
        checkbox: function(key) {
            return "checkbox" + key;
        },
        enterInto: function(item) { //进入管线列表
            this.$emit('changelist', item);
            // this.$emit('chooseNet', );
        },
        createinfo: function() {
            var styleobj = {
                title: '新增管网',
                width: '600',
                height: '350',
            };
            var inputobj = {
                "pipeNetworkName": "",
                "pipeNetworkRemark": "",
            };
            this.$emit('createinfo', styleobj, inputobj);
            // $("#addNet").modal();
        },
        clickLi: function(item) {
            this.$emit('chooseNet', item.objectId);
        },
        checkNetToS: function(item) {
            var that = this;
            if ($.inArray(item.objectId, this.startuserpipe) >= 0) {
                xxwsWindowObj.xxwsAlert("该管网已经启用，无须再次操作");
            } else {
                xxwsWindowObj.xxwsAlert("确认启用该管网", function() {
                    //与服务器进行通讯，然后刷新列表  
                    that.startPipe(item.objectId);
                }, true);
            }
        },
        startPipe: function(objectId) {
            var _data = {
                    objectId: objectId,
                }
                // this.$emit("requestnet");
                // $.ajax({
                //     type: "POST",
                //     url: "/cloudlink-inspection-event/commonData/pipemapnetwork/update?token=" + lsObj.getLocalStorage('token'),
                //     contentType: "application/json",
                //     data: JSON.stringify(_data),
                //     dataType: "json",
                //     success: function(data) {
                //         if (data.success == 1) {
                //             /*此处针对BO进行重新存储*/
                //             xxwsWindowObj.xxwsAlert("启用成功", function() {
                //                 //此处调用父级方法，进行列表刷新
                //             });
                //         } else {
                //             xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                //         }
                //     }
                // });
        }
    },
}


var pipe_left = {
    props: {
        pipenetdatas: {
            type: Array,
        },
        pointerdatas: {
            type: Array,
        },
        snetid: {
            type: String
        },
        slineid: {
            type: String,
        }
    },
    data: function() {
        return {
            currentList: 'net',
            styleobj: {},
            currentNetName: '',
            chooseLine: [],
            netshow: false,
            pipeshow: false,
        }
    },
    template: '#pipe-left',
    components: {
        // 'pipe-left-top': pipe_left_top,
        'pipe-line-list': pipe_line_list,
        'pipe-net-list': pipe_net_list,
    },
    computed: {
        // startpipe: function() {
        //     var that = this;
        //     this.pipenetdatas.forEach(function(item) {
        //         if (item.pipeNetworkUsed == 1) {
        //             that.startuserpipe.push(item.objectId);
        //         }
        //     });
        //     return that.startuserpipe;
        // },
    },
    methods: {
        changelist: function(item) {
            if (item) {
                this.currentList = 'line';
                this.currentNetName = item.pipeNetworkName;
                this.chooseLine = this.pointerdatas.filter(function(items) {
                    return items.pipeNetworkId == item.objectId;
                });
            } else {
                this.currentList = 'net';
            }

            //此时根据id获取管网下面的所有管线
        },
        chooseNet: function(objectId) {
            this.$emit('choosenet', objectId);
        },
        checkedline: function(objectId) {
            this.$emit('checkedline', objectId);
        },
        createinfo: function(styleobj, inputobj) {
            this.styleobj = styleobj;
            this.inputobj = inputobj;
            if (this.styleobj.title == "新增管网") {
                this.netshow = !this.netshow;
            }
            if (this.styleobj.title == "新增管线") {
                this.pipeshow = !this.pipeshow;
            }
        },
        createsave: function() {
            if (this.styleobj.title == "新增管网") {
                this.saveNet();
            } else {
                this.saveLine();
            }
        },
        saveNet: function() {
            var that = this;
            var _data = {
                "objectId": baseOperation.createuuid(),
                "pipeNetworkName": that.inputobj.pipeNetworkName.trim(),
                "pipeNetworkRemark": that.inputobj.pipeNetworkRemark.trim(),
                "pipeNetworkUsed": 0,
            };
            if (that.verifyNet()) {
                $.ajax({
                    type: "POST",
                    url: "/cloudlink-inspection-event/commonData/pipemapnetwork/save?token=" + lsObj.getLocalStorage('token'),
                    contentType: "application/json",
                    data: JSON.stringify(_data),
                    dataType: "json",
                    success: function(data) {
                        if (data.success == 1) {
                            /*此处针对BO进行重新存储*/
                            xxwsWindowObj.xxwsAlert("保存成功", function() {
                                that.netshow = !that.netshow;
                                that.$emit("updatenetdetailbyid", _data.objectId);
                            });
                        } else {
                            xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                        }
                    }
                });
            }
        },
        saveLine: function() {
            var that = this;
            var _data = {
                objectId: baseOperation.createuuid(),
                pipeNetworkId: this.snetid,
                pipeLineName: this.inputobj.pipeLineName.trim(),
                pipeMaterial: this.inputobj.pipeMaterial.trim(),
                pipeDiameter: this.inputobj.pipeDiameter.trim(),
                pipeThickness: this.inputobj.pipeThickness.trim(),
                pipeLength: this.inputobj.pipeLength.trim(),
                pipeLineRemark: this.inputobj.pipeLineRemark.trim(),
            };
            if (that.verifyPipe()) {
                $.ajax({
                    type: "POST",
                    url: "/cloudlink-inspection-event/commonData/pipemapline/save?token=" + lsObj.getLocalStorage('token'),
                    contentType: "application/json",
                    data: JSON.stringify(_data),
                    dataType: "json",
                    success: function(data) {
                        if (data.success == 1) {
                            /*此处针对BO进行重新存储*/
                            xxwsWindowObj.xxwsAlert("保存成功", function() {
                                that.pipeshow = !that.pipeshow;
                                that.$emit("updatelinedetailbyid", _data.objectId);
                            });
                        } else {
                            xxwsWindowObj.xxwsAlert("服务异常，请稍候重试");
                        }
                    }
                });
            }
        },
        verifyNet: function() {
            var that = this;
            //进行填报管网验证
            if (that.inputobj.pipeNetworkName.trim().length == 0) {
                xxwsWindowObj.xxwsAlert("管网名称不能为空");
                return false;
            }
            if (that.inputobj.pipeNetworkName.trim().length > 50) {
                xxwsWindowObj.xxwsAlert("管网名称长度不能超过50个字");
                return false;
            }
            if (that.inputobj.pipeNetworkRemark.trim().length > 201) {
                xxwsWindowObj.xxwsAlert("管网备注不能超过200个字");
                return false;
            }
            return true;
        },
        verifyPipe: function() {
            if (this.inputobj.pipeLineName.trim().length == 0) {
                xxwsWindowObj.xxwsAlert("管线名称不能为空");
                return false;
            }
            if (this.inputobj.pipeLineName.trim().length > 50) {
                xxwsWindowObj.xxwsAlert("管线名称长度不能超过50个字");
                return false;
            }
            if (this.inputobj.pipeMaterial.trim().length > 50) {
                //针对材质写正则
                xxwsWindowObj.xxwsAlert("管线材质长度不能超过50个字");
                return false;
            }
            if (this.inputobj.pipeDiameter.trim().length > 50) {
                //针对管径写正则
                xxwsWindowObj.xxwsAlert("管线管径长度不能超过50个字");
                return false;
            }
            if (this.inputobj.pipeThickness.trim().length > 50) {
                //针对壁厚写正则
                xxwsWindowObj.xxwsAlert("管线壁厚长度不能超过50个字");
                return false;
            }
            if (this.inputobj.pipeLength.trim().length > 0) {
                //针对管线长度写正则
                var flag = true;
                var regNum = /^[0-9]{1,1}\d{0,8}(\.\d{1,2})?$/;
                if (!regNum.test(this.inputobj.pipeLength.trim())) {
                    xxwsWindowObj.xxwsAlert("管线长度格式错误");
                    flag = false;
                }
                return flag;
            }
            if (this.inputobj.pipeLineRemark.trim().length > 201) {
                //针对管线备注写正则
                xxwsWindowObj.xxwsAlert("管线备注长度不能超过200个字");
                return false;
            }
            return true;
        }
    }
}