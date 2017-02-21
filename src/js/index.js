var titleObj = {
    aDomObj : $('.dashboard .qtty .num'),
    init : function(){
        var that = this;
        that.request();
    },
    request : function(){
        var that = this;
        $.ajax({
            type: "GET",
            url: "/cloudlink-inspection-analysis/patrolStatistical/getPatrolStatisticsData",
            contentType: "application/json",
            data: {
                token :　'98059ddb-2f44-4c5c-890c-eba343f6b104'
            },
            dataType: "json",
            success: function(data, status) {
                //console.log(data)
                if(data.success != 1){
                    alert('网络连接出错！code:-1')
                    return;
                }
                var obj = data.rows[0];
                var rows = [obj.userCount,obj.patrollingCountToday,obj.eventCountToday,obj.taskCountToday];
                that.render(rows);
            },
            complete:function(xhr,txt){
                //console.log(xhr);
            },
            statusCode: {
                404: function() {
                    //alert('page not found');
                }
            }
        });
    },
    render : function(arr){
        if(!arr instanceof Array || arr.length !== 4){
            return;
        }
        var that = this;
        that.aDomObj.each(function(i){
            $(this).html(arr[i]);
        })
    }
};
titleObj.init();

var taskChartObj = {
    myChart : echarts.init($('#taskChart')[0]),
    option : null,
    init : function(){
        var that = this;
        that.request();
        that.renderWeek();
    },
    resize : function(){
        var that = this;
        if(!that.option){return}
        that.myChart.resize();
        that.myChart.setOption(that.option);
    },
    renderWeek : function(){
        var that = this;
        var day1 = new Date().getWeekStartDate().Format('yyyy.MM.dd');
        var day2 = new Date().getWeekEndDate().Format('yyyy.MM.dd');
        $('.thisWeek').html(day1 +' - '+ day2);
    },
    request : function(){
        var that = this;
        $.ajax({
            type: "GET",
            url: "/cloudlink-inspection-task/task/getEnterpriseTasksCountForWeek",
            contentType: "application/json",
            data: {
                token :　'98059ddb-2f44-4c5c-890c-eba343f6b104'
            },
            dataType: "json",
            success: function(data, status) {
                //console.log(data)
                if(data.success != 1){
                    alert('网络连接出错！code:-1')
                    return;
                }
                var obj = data.rows[0];
                that.renderChart(obj.completedCount,obj.disposingCount);
            },
            complete:function(xhr,txt){
                //console.log(xhr);
            },
            statusCode: {
                404: function() {
                    alert('网络连接出错！code:404');
                }
            }
        });
    },
    renderChart : function(done,doing){
        var that = this;
        done = +done;
        doing = +doing;
        var all = done + doing;
        $('#taskChart_all').html(all);
        $('#taskChart_done').html(done);
        $('#taskChart_doing').html(doing);
        var p_all = all === 0? 0 : 100;
        var p_done = all === 0? 0 : Math.ceil(done/(all)*100);
        var p_doing = all === 0? 0 : Math.ceil(doing/(all)*100);
        that.drawChart(p_all,p_done,p_doing);
    },
    drawChart : function(p_all,p_done,p_doing){
        var that = this;
        that.option = {
            color : ['#64bd63','#59b6fc','#ec7145'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: '{b}：{c}%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

            xAxis : [
                {
                    data : ['任务总量', '已完成', '处理中'],
                    boundaryGap:true,
                    axisTick: {
                        show : false,
                    },
                    boundaryGap : ['20%','20%'],
                    axisLine: {
                        show: false,
                    },
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show : false,
                    },
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:[p_all,p_done,p_doing],
                    itemStyle: {
                        normal: {
                            index : 0,
                            color: function(params) {
                                var arr = ['#64bd63','#59b6fc','#ec7145'];
                                return arr[params.dataIndex];
                            }
                        }
                    },
                    label : {
                        normal : {
                            show : true,
                            position : 'top',
                            offset : [0,-5],
                            formatter: '{c}%',
                            textStyle : {
                                color : '#333',
                                fontSize : 14,
                            }
                        }
                    }
                }
            ]
        };
        that.myChart.setOption(that.option);

    }
};
taskChartObj.init();

var eventChartObj = {
    myChart : echarts.init($('#eventChart')[0]),
    option : null,
    init : function(){
        var that = this;
        that.request();
    },
    resize : function(){
        var that = this;
        if(!that.option){return}
        that.myChart.resize();
        that.myChart.setOption(that.option);
    },
    request : function(){
        var that = this;
        $.ajax({
            type: "GET",
            url: "/cloudlink-inspection-event/eventInfo/getEnterpriseEventsCountForWeek",
            contentType: "application/json",
            data: {
                token :　'98059ddb-2f44-4c5c-890c-eba343f6b104'
            },
            dataType: "json",
            success: function(data, status) {
                //console.log('shiajin' +　data)
                if(data.success != 1){
                    alert('网络连接出错！code:-1')
                    return;
                }
                var obj = data.rows[0];
                that.render(obj.pipeEquipmentCount,obj.disasterCount,obj.constructionCount);
            },
            complete:function(xhr,txt){
                //console.log(xhr);
            },
            statusCode: {
                404: function() {
                    alert('网络连接出错！code:404');
                }
            }
        });
    },
    render : function(pipe,nature,other){
        var that = this;
        pipe = +pipe;
        nature = +nature;
        other = +other;
        var all = pipe + nature + other;
        $('#eventChart_all').html(all);
        $('#pipeEquipmentCount').html(pipe);
        $('#disasterCount').html(nature);
        $('#constructionCount').html(other);


        that.drawChart(pipe,nature,other);
    },
    drawChart : function(pipe,nature,other){
        var that = this;
        that.option = {
            color : ['#59b6fc','#64bd63','#9186e4'],
            tooltip: {
                trigger: 'item',
                formatter: "{b} {c} 起"
            },
            series: [
                    {
                        type:'pie',
                        radius: ['35%', '65%'],

                        data:[
                            {value:pipe, name:'管线设备'},
                            {value:nature, name:'自然灾害'},
                            {value:other, name:'第三方施工'},

                        ],
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: '{b}: {d} %',
                                textStyle: {
                                    color: '#666',
                                    fontSize: 14,
                                },
                            }

                        }
                    }
            ]
        };
        that.myChart.setOption(that.option);

    }
};
eventChartObj.init();
//


var taskListObj = {
    init : function(){
        var that = this;
        that.request();
    },
    request : function(){
        var that = this;
        $.ajax({
            type: "GET",
            url: "/cloudlink-inspection-task/task/getMyUnDisposedTasks",
            contentType: "application/json",
            data: {
                token :　'98059ddb-2f44-4c5c-890c-eba343f6b104',
                status :　20 , //20: 处理中    21: 已关闭
                size : 3
            },
            dataType: "json",
            success: function(data, status) {
                //console.log(data)
                if(data.success != 1){
                    alert('网络连接出错！code:-1')
                    return;
                }

                var obj = data.rows[0];
                var count = obj.total;
                var arr = obj.list;
                that.render(count,arr);

            },
            complete:function(xhr,txt){
                //console.log(xhr);
            },
            statusCode: {
                404: function() {
                    alert('网络连接出错！code:404');
                }
            }
        });
    },
    render : function(count,arr){
        var that = this;
        $('#eventList_total').html(count);
        var sHtml = '';
        var iconObj = {
            '00' : 'record',
            '10' : 'record',
            '20' : 'ask',
            '30' : 'advise'
        };
        arr.forEach(function(item,index,arr){
            sHtml = sHtml +'<div class="line">'
                               +'<div class="line_title">'
                                   +'<span class="person">'+item.createUserName+'</span>'
                                   +'<span>任务号：</span>'
                                   +'<span>'+item.code+'</span>'
                               +'</div>'
                               +'<div class="sub_wrap">'
                                   +'<div class="icon ' + iconObj[item.disposeType] + '">'
                                   +'</div>'
                                   +'<div class="mybtn">'
                                        +'处置'
                                   +'</div>'
                                   +'<div class="content">'
                                       +'<div class="desc">'
                                            +item.eventDescription
                                       +'</div>'
                                       +'<div class="dis_title">'
                                           +'<span class="person">'+item.disposeUserName+'</span>'
                                           +'<span class="handle">'+item.disposeTypeName+'</span>'
                                           +'<span class="date">'+item.disposeTime+'</span>'
                                       +'</div>'
                                       +'<div class="dispose">'
                                            +item.disposeContent
                                       +'</div>'
                                   +'</div>'
                               +'</div>'
                           +'</div>';

        });
        $('#taskList_wrapper').html(sHtml);
    }
};
taskListObj.init();

var eventListObj = {
    init : function(){
        var that = this;
        that.request();
    },
    request : function(){
        var that = this;
        $.ajax({
            type: "GET",
            url: "/cloudlink-inspection-event/eventInfo/getEnterpriseEventsList",
            contentType: "application/json",
            data: {
                token :　'98059ddb-2f44-4c5c-890c-eba343f6b104',
                status :　20 , //20: 处理中    21: 已关闭
                size : 3
            },
            dataType: "json",
            success: function(data, status) {
                console.log(data)
                if(data.success != 1){
                    alert('网络连接出错！code:-1')
                    return;
                }

                var obj = data.rows[0];
                var count = obj.total;
                var arr = obj.list;
                that.render(count,arr);

            },
            complete:function(xhr,txt){
                //console.log(xhr);
            },
            statusCode: {
                404: function() {
                    alert('网络连接出错！code:404');
                }
            }
        });
    },
    render : function(count,arr){
        var that = this;
        $('#eventList_total').html(count);
        var sHtml = '';
        arr.forEach(function(item,index,arr){
            sHtml = sHtml +'';

        });
        $('#taskList_wrapper').html(sHtml);
    }
};
eventListObj.init();

/* 窗口大小改变时，图表随之改变 */
(function resizeChart(){
    window.onresize = function(){
        taskChartObj.resize();
        eventChartObj.resize();
    }
})();






