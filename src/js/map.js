
(function resizeWrapper(){
    $('')
})();

(function setMap(){
    var map = new BMap.Map("container");          // 创建地图实例
    var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
    map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
})();

var tabObj = {
    tabsTitle : $('.item_wrapper .item'),

    people : $('#people'),
    event : $('#event'),
    location : $('#location'),
    tool : $('#tool'),

    closeBtn : $('.result_wrapper .close_btn'),

    currentTab : null,

    init : function(){
        var that = this;
        that.bindEvent();
    },
    bindEvent : function(){
        var that = this;
        // 切换Tab事件
        that.tabsTitle.click(function(){
            var s = this.dataset.tab;
            if ( s !== that.currentTab ){
                that.closeTip();
                that.showTip(s);
                return;
            }
            that.closeTip();
            $(this).removeClass('active');
        });
        //关闭tab事件
        that.closeBtn.click(function(){
            that.closeTip();
        });
        //
    },
    bindSearchEvent : function(){
        var that = this;
        $('#search_people').click(function(){

        });


    },
    requestPeople : function(){
        var that = this;
        $.ajax();
    },
    showTip : function(currentTab){
        var that = this;
        if(!currentTab){
            return;
        }
        $('#'+currentTab+'_title').addClass('active');
        that[currentTab].removeClass('hide');
        that.currentTab = currentTab;
    },
    closeTip : function(){
        var that = this;
        if(!that.currentTab){
            return;
        }
        $('#'+that.currentTab+'_title').removeClass('active');
        that[that.currentTab].addClass('hide');
        that.currentTab = null;
    }
}

tabObj.init();


