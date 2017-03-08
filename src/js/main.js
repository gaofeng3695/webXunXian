$(document).ready(function() {
    resizeMain();
    menuListListener();
    initPersonal(); //首次登录进来，进行初始化个人的基本信息
    routerObj.init()
});
var resizeMain = function() {
    document.getElementById("page-wrapper").style.height = document.documentElement.clientHeight - 55 + 'px';
}
window.onresize = function() {
    resizeMain();
}
var menuListListener = function() {
    $(".nav.navbar-right.top-nav>li").on("click", function() {
        var menuid = $(this).attr("menuid");
        switch (menuid) {
            /*case 'help':
                lsObj.clearAll();
                location.hash = '#/help';
                break;*/
            case 'signOut':
                lsObj.clearAll();
                location.href = 'login.html';
                break;
        }
    });
}

var loadRelativePage = function(_url) {
        document.getElementById("page-wrapper").src = _url;
        var $domArr = $('.side-nav li a');
        $domArr.removeClass('active');
        for(var i = 0; i < $domArr.length; i++){
            var _this = $domArr[i];
            if(_this.hash === location.hash){
                //console.log($(_this))
                $(_this).addClass('active');
                return;
            }
        }
    }
    /*进行个人信息初始化 */
var initPersonal = function() {
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    $(".userName").text(userBo.userName);
    // $(".new_company").html("");
    // var current = userBo.enterpriseName + '<img src="/src/images/main/refresh.png">';
    // $(".new_company").append(current);
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?token=" + lsObj.getLocalStorage('token') + "&businessId=" + userBo.objectId + "&bizType=pic",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            if (data.success == 1) {
                if (data.rows.length > 0) {
                    if (data.rows[0].fileId != null && data.rows[0].fileId != "") {
                        $(".person-img").attr('src', "/cloudlink-core-file/file/getImageBySize?fileId=" + data.rows[0].fileId + "&viewModel=fill&width=500&hight=500");
                    }
                }

            }
        }
    });
}
/* 前端路由模块 */
var routerObj = {
    router : null,
    init : function(){
        var that = this;
        that.router = Router({
            '/index': function(){
                loadRelativePage("/src/html/index.html");
            },
            '/event': function(){
                loadRelativePage("/src/html/event.html");
            },
            '/task': function(){
                loadRelativePage("/src/html/task.html");
            },
            '/track': function(){
                loadRelativePage("/src/html/track.html");
            },
            '/map': function(){
                loadRelativePage("/src/html/map.html");
            },
            '/equipment': function(){
                loadRelativePage("/src/html/none.html");
            },
            '/statistics': function(){
                loadRelativePage("/src/html/none.html");
            },
            '/management': function(){
                loadRelativePage("/src/html/none.html");
            },
            '/news': function(){
                loadRelativePage("/src/html/none.html");
            },
            '/personal': function(){
                loadRelativePage("/src/html/personal.html");
            },
            '/updatepass': function(){
                loadRelativePage("/src/html/forgetPassword.html");
            },
            '/setLogin': function(){
                loadRelativePage("/src/html/setLogin.html");
            },
            '/help': function(){
                loadRelativePage("/src/html/help.html");
            }
        });
        that.router.init('/index');
    },
};
