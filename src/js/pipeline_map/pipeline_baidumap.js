var pipeline_baidumap = {
    template: '#pipeline_baidumap',
    props: {
        linedetails : {},
        linedetailsedited : {},
        istabshow : {
            default : false
        },
    },
    data: function () {
        //alert(this.linedetails)
        return {
            sCurrentTap: '', //draw,edit,keep,save

        };
    },
    computed: {
        aLineDetailsToShow: function () {
            if(!this.linedetailsedited){
                this.sCurrentTap = '';
            }
            return (this.linedetails.length ===1 && this.linedetailsedited)? [this.linedetailsedited] : this.linedetails;
        },
        isNoPoints : function(){ //用来控制tab显示的标签
            if( this.aLineDetailsToShow.length === 1 ){
                if( this.aLineDetailsToShow[0].line.length === 0 ){
                    return true;
                }
            }
            return false;
        },
        isEditable : function(){ //控制管线是否为可编辑状态
            if(this.sCurrentTap === 'edit'){
                return true;
            }
            return false;
        },
        isDrawable : function(){ //控制是否启用新增管线的点
            if(this.sCurrentTap === 'draw'){
                return true;
            }
            return false;
        }
        // isShowTab: function () {
        //     alert(this.isTabShow)
        //     return this.isTabShow;
        // }
    },
    watch: {
        sCurrentTap : function(newVal){
            this._draw_lines();
            if( newVal === 'save'){
                //console.log('——————————触发保存')
                this.$emit('savedetail');
            }else{
                console.log('——————————编辑状态发生改变')

            }
        },
        aLineDetailsToShow: function () {
            console.log('——————————数据来源发生改变')
            this._draw_lines();
        },
    },
    mounted: function () {
        this.mapObj = createMap({ //创建地图实例
            sNodeId: 'mapContainer'
        });
        this._draw_lines(); //划线
        this._addDrawLineEvent(this.mapObj.map);

    },
    methods: {
        changeTab : function(sTab){ //tab切换
            if(this.sCurrentTap === sTab){
                this.sCurrentTap = ''
            }else{
                this.sCurrentTap = sTab;
            }
        },
        _draw_lines: function () { //每次线的状态的改变都会触发此方法
            var that = this;
            var map = this.mapObj;
            var aline = this.aLineDetailsToShow;
            map.clearOverlays(); //清空所有覆盖物
            that.topline = '';
            console.log('绘制地图，清空所有覆盖物');
            var aPoints = [];



            aline.forEach(function (item, index) {
                if(!item.line || item.line.length === 0){ //没有坐标点就返回
                    return;
                }
                if(aline.length === 1 ){ //只有一条线的时候才会标注起止图表
                    if(item.line.length > 0){
                        var startPoint = map.draw_pointMarker(item.line[0].bdLon,item.line[0].bdLat,map.startMarker);
                    }
                    if(item.line.length > 1){
                        var endMarker = map.draw_pointMarker(item.line[item.line.length-1].bdLon,item.line[item.line.length-1].bdLat,map.endMarker);
                    }
                }

                if(item.line.length > 1){ //含有两个坐标点以上，画线
                    var topline = map.draw_line(item.line, {
                        strokeColor: item.pipeColor,
                        strokeWeight: item.pipeWeight,
                        strokeStyle: item.pipeStyle, //dashed
                        strokeOpacity: 1,
                        enableEditing : that.isEditable || false,
                    });
                    if( (that.isEditable || that.isDrawable) && index === 0){ //如果处于编辑状态，添加线的更新事件
                        //that.topline = '';
                        that.topline = topline;
                        that.topline.addEventListener('lineupdate',function(){
                            var linePoints = that.topline.getPath();
                            var line = linePoints.map(function(item,index){
                                return {
                                    "lon": "",
                                    "lat": "",
                                    "bdLon": item.lng,
                                    "bdLat": item.lat,
                                    "rowIndex": index
                                }
                            });
                            var oDetail = JSON.parse(JSON.stringify(that.aLineDetailsToShow[0]));
                            oDetail.line = line;
                            //console.log(oDetail);
                            that.$emit('changeline',oDetail);
                        })
                    }
                }
                if( !that.isEditable && !that.isDrawable){ //不是编辑和划线状态才会设置视野范围
                    aPoints = aPoints.concat(item.line.map(function (item) {
                        return new BMap.Point(item.bdLon, item.bdLat);
                    }));
                }

                if(that.isDrawable){ //只有划线状态才会更改鼠标样式
                    map.map.setDefaultCursor('crosshair');
                    map.map.setDraggingCursor('crosshair');
                }else{
                    map.map.setDefaultCursor(that.defaultCursor);
                    map.map.setDraggingCursor(that.draggingCursor);
                }

            });

            map.map.setViewport(aPoints, { //设定视野范围
                enableAnimation: true,
                margins: [0, 0, 0, 0],
            });

        },
        _addDrawLineEvent: function (oMap) {
            var that = this;

            this.defaultCursor = oMap.getDefaultCursor();
            this.draggingCursor = oMap.getDraggingCursor();

            oMap.addEventListener("click", function (e) {
                if (!that.isDrawable) {
                    return;
                }
                var lon = e.point.lng;
                var lat = e.point.lat;
                var point = new BMap.Point(e.point.lng, e.point.lat);
                var aLine = that.aLineDetailsToShow[0].line;


                if(that.topline){ //已经画过线
                    that.topline.setPath(that.topline.getPath().concat([point]));
                }else{
                    if( aLine.length === 0 ){
                        var line = [{
                            "lon": "",
                            "lat": "",
                            "bdLon": lon,
                            "bdLat": lat,
                            "rowIndex": 1
                        }];
                    }else if( aLine.length === 1 ){
                        var line = aLine.concat([{
                            "lon": "",
                            "lat": "",
                            "bdLon": lon,
                            "bdLat": lat,
                            "rowIndex": 2
                        }]);
                    }
                    var oDetail = JSON.parse(JSON.stringify(that.aLineDetailsToShow[0]));
                    oDetail.line = line;
                    //console.log(oDetail);
                    that.$emit('changeline',oDetail);
                }
            });
            oMap.addEventListener("mousemove", function (e) {
                if (!that.isDrawable) {
                    return;
                }
                if (that.dashLineDrawed) {
                    that.mapObj.map.removeOverlay(that.dashLineDrawed);
                }
                //console.log(that.aLineDetailsToShow)
                var aLine = that.aLineDetailsToShow[0].line;
                if(aLine.length === 0){
                    return;
                }
                var lastPoint = new BMap.Point(aLine[aLine.length-1].bdLon, aLine[aLine.length-1].bdLat);


                var lon = e.point.lng;
                var lat = e.point.lat;
                var newPointt = new BMap.Point(lon, lat);
                //console.log(e.point.lng + "," + e.point.lat);

                that.dashLineDrawed = that.mapObj.draw_line([lastPoint, newPointt], {
                    strokeColor: that.aLineDetailsToShow[0].pipeColor || "blue",
                    strokeWeight: that.aLineDetailsToShow[0].pipeWeight || 2,
                    strokeOpacity: 0.5,
                    strokeStyle: "dashed"
                }, true);
            });
            oMap.addEventListener("rightclick", function (e) {
                if (that.isEditable || that.isDrawable) {
                    that.sCurrentTap = '';
                    if (that.dashLineDrawed) {
                        that.mapObj.map.removeOverlay(that.dashLineDrawed);
                    }
                }
            });
        },

        // startDrawLine: function () { //开始画线
        //     this.map.setDefaultCursor('crosshair');
        //     this.map.setDraggingCursor('crosshair');
        //     this.map.removeOverlay(this.lineDrawed);
        //     this.isEditable = true;
        // },
        // editLine: function (oLine) { //编辑线
        //     //this.mapObj.linePoints = this.topline.getPath();
        //     //this.map.setDefaultCursor('crosshair');
        //     this.map.setDraggingCursor('crosshair');
        //     this._drawLineEditable(oLine);
        // },
        // stopDrawLine: function () {
        //     this.map.setDefaultCursor(this.defaultCursor);
        //     this.map.setDraggingCursor(this.draggingCursor);
        //     this.map.removeOverlay(this.dashLineDrawed);
        //     this.isEditable = false;
        // },
        // continueDrawLine: function (oLine) {
        //     this.map.setDefaultCursor('crosshair');
        //     this.map.setDraggingCursor('crosshair');
        //     oLine = this.lineDrawed ? this.lineDrawed : oLine;
        //     this._drawLineEditable(oLine);
        //     this.isEditable = true;
        // }

    },
};