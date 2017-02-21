
(function(){
    /*
    * 对Date的扩展，将 Date 转化为指定格式的String
    * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    * 例子：
    * (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
    * (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
    * (new Date()).Format("yyyyMMddHHmmssS")      ==> 20060702080904423
    */
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    /*
    ** 获取本周开始日期
    */
    Date.prototype.getWeekStartDate = function(){
        var date = new Date();
        var day = date.getDay();
        day = day===0?7:day;
        date.setDate(date.getDate() - (day - 1));
        return date;
    }

    /*
    ** 获取本周结束日期
    */
    Date.prototype.getWeekEndDate = function(){
        var date = new Date();
        var day = date.getDay();
        day = day===0?7:day;
        date.setDate(date.getDate() + ( 7 - day));
        return date;
    }

    /*
    ** 获取本月开始日期
    */
    Date.prototype.getMonthStartDate = function(){
        var date = new Date();
        date.setDate(1);
        return date;
    }

    /*
    ** 获取本月结束日期
    */
    Date.prototype.getMonthEndDate = function(){
        var date = new Date();
        var Month = date.getMonth();
        date.setMonth(Month+1);
        date.setDate(1);
        date.setDate(0);
        return date;
    }
})();


