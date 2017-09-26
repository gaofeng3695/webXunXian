// window.onerror = function (msg, url, line) {
//     alert("erro" + msg + "\n" + url + ":" + line);
//     return true;
// };

var vm = new Vue({
    el: '#app',
    data: {

        sNetId_choosed: '', //被选中的管网的ID
        sLineId_choosed: '', //被选中的管线的ID

        olineDetail_edited : '',//存在已被编辑的管线

        aNetDetails: [], //所有管网的详情数组
        aLineDetails: [], //所有管线的详情数组s
    },
    computed: {
        aNetId_active: function () {
            return this.aNetDetails.filter(function (item) {
                return +item.pipeNetworkUsed === 1;
            });
        },
        oNetDetail_choosed: function () {
            var that = this;
            if (this.sNetId_choosed) {
                return this.aNetDetails.filter(function (item) {
                    return item.objectId === that.sNetId_choosed;
                })[0];
            }
            return '';
        },
        oLineDetail_choosed: function () {
            var that = this;
            if (this.sLineId_choosed) {
                return this.aLineDetails.filter(function (item) {
                    return item.objectId === that.sLineId_choosed;
                })[0];
            }
            return '';
        },
        aLineDetailsToShow: function () {
            var that = this;
            //return (function () {
            if (that.sNetId_choosed && !that.sLineId_choosed) {
                return that.aLineDetails.filter(function (item) {
                    return item.pipeNetworkId === that.sNetId_choosed;
                });
            }
            if (that.sLineId_choosed) {
                return that.aLineDetails.filter(function (item) {
                    return item.objectId === that.sLineId_choosed;
                });
            }
            return that.aLineDetails.filter(function (item) {
                for (var i = 0; i < that.aNetId_active.length; i++) {
                    if (that.aNetId_active[i].objectId === item.pipeNetworkId) {
                        return true;
                    }
                }
                return false;
            });
            //})();
        },
    },
    watch : {
        aLineDetailsToShow : function(newVal){
            // console.log('this is aLineDetailsToShow')
            // console.log(newVal)
        },
        sLineId_choosed : function(){
            this.olineDetail_edited = '';
            // console.log('this is after sLineId_choosed')
            // console.log(this.olineDetail_edited)
        }
    },
    components: {
        'pipe-left': pipe_left,
        'pipeline-baidumap': pipeline_baidumap,
        'pipeline-edit': pipeline_edit
    },
    mounted: function () {
        console.log('#app mounted');

        this._requestNetDetails();
        this._requestLineDetails();



    },
    methods: {

        _requestNetDetails: function () { //请求管网详情列表
            var that = this;
            // alert('start')
            $.getJSON('/src/js/pipeline_map/netDetails.json', "", function (data) {
                if (+data.success == 1) {
                    that.aNetDetails = data.rows;
                }
                //console.log(data)
            });
        },
        _requestLineDetails: function () { //请求管线详情列表
            var that = this;
            $.getJSON('/src/js/pipeline_map/lineDetails.json', "", function (data) {
                if (+data.success == 1) {
                    that.aLineDetails = data.rows;
                }
                //console.log(data)
            });
        },
        chooseNet: function (sNetId) { //选择管网，清空则传空
            this.sNetId_choosed = sNetId || '';
            //console.log('oNetDetail_choosed:' + this.oNetDetail_choosed);
        },
        chooseLine: function (sLineId) { //选择管线，清空则传空
            this.sLineId_choosed = sLineId || '';
            //console.log('oLineDetail_choosed:' + this.oLineDetail_choosed);
        },
        clearNetDetail: function () {
            this.oNetDetail_choosed = '';
        },
        updateNetDetailById: function (sId, nFlag) { //更新管网详情，入参管网Id
            //1增，2删，3改状态，4改详情
            if (nFlag === 2) {
                return this.aNetDetails = this.aNetDetails.filter(function (item) {
                    return item.objectId !== sId;
                });
            }
            if (nFlag === 3) {
                return this.aNetDetails = this.aNetDetails.map(function (item) {
                    if (item.objectId === sId) {
                        item.pipeNetworkUsed = item.pipeNetworkUsed == 0 ? 1 : 0;
                    }
                    return item;
                });
            }
        },
        updateLineDetailById: function (sId) { //更新管线详情，入参管线Id


        },
        editLineDetail: function (OLineDetail) { //变更坐标点，更改线的样式，传入关键点，点击保存
            console.log('管线的坐标或者样式发生改变');
            this.olineDetail_edited = OLineDetail;

            //会替换 oLineDetail_choosed
        },
        saveLineAttr: function () {

        },
        saveLineStyleAndPoint: function () {

        }



    }

});