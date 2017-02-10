var titleObj = {
    aDomObj : $('.dashboard .qtty .num'),
    init : function(){
        var that = this;
        that.request();
    },
    request : function(){
        var that = this;
        var obj = {
            a : 23,
            b : 23,
            c : 3,
            d : 23
        }
        that.render(obj);
    },
    render : function(obj){
        var that = this;
        var arr = [obj.a,obj.b,obj.c,obj.d];
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
    },
    resize : function(){
        var that = this;
        if(!that.option){return}
        that.myChart.resize();
        that.myChart.setOption(that.option);
    },
    request : function(){
        var that = this;
        that.render();
    },
    render : function(){
        var that = this;
        that.drawChart();
    },
    drawChart : function(){
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
                    data:[100, 70, 30],
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
        that.render();
    },
    render : function(){
        var that = this;
        that.drawChart();
    },
    drawChart : function(){
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
                            {value:45, name:'管线设备'},
                            {value:30, name:'自然灾害'},
                            {value:25, name:'第三方施工'},

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

var eventListObj = {
    init : function(){
        var that = this;

    },
    request : function(){
        var that = this;
    },
    render : function(){
        var that = this;

    }
};


/* 窗口大小改变时，图表随之改变 */
(function resizeChart(){
    window.onresize = function(){
        taskChartObj.resize();
        eventChartObj.resize();
    }
})();






