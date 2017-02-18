var trackObj = {
    $items : $('.top .item'),

    defaultObj : {
        "status":"1",    //1:有事件，0：无事件，1,0:全部
        "startDate":"",  //开始日期
        "endDate":"",    //结束日期
        "keyword":"" ,  //巡线人，巡线编号
        "userIds":"",  //逗号分隔的userId
        "pageNum":1,  //第几页
        "pageSize":10 //每页记录数
    },
    querryObj : {
        "status":"1",    //1:有事件，0：无事件，1,0:全部
        "startDate":"",  //开始日期
        "endDate":"",    //结束日期
        "keyword":"" ,  //巡线人，巡线编号
        "userIds":"",  //逗号分隔的userId
        "pageNum":1,  //第几页
        "pageSize":10 //每页记录数
    },

    init : function(){
        var that = this;
        console.log(that.$items);
        that.bindEvent();
    },
    render:function(){

    },
    bindEvent : function(){
        var that = this;
        that.$items.click(function(){
            var key = $(this).parent()[0].dataset.class;
            var value = this.dataset.value;
            if( key === 'date' ){
                that.setDate(value);
            }else{
                that.querryObj[key] = value;
            }
            console.log(that.querryObj)

        });
    },
    setDate : function(value){
        switch(value){
            case 'day':{
                var date = new Date()
            }
        }
    },
    resetActive : function(){

    },
    setquerryObj : function(){

    },
    request : function(){
        var that = this;
        console.log();
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/login/loginByPassword",
            contentType: "application/json",
            data: '',
            dataType: "text",
            success: function(data) {

            }
        });
    }
};
trackObj.init();

