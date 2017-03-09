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
        for (var i = 0; i < $domArr.length; i++) {
            var _this = $domArr[i];
            if (_this.hash === location.hash) {
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
        if (userBo.profile_photo != null && userBo.profile_photo != "") {
            $(".person-img").attr('src', "/cloudlink-core-file/file/getImageBySize?fileId=" + userBo.profile_photo + "&viewModel=fill&width=500&hight=500");
        }
    }
    /* 前端路由模块 */
var routerObj = {
    router: null,
    init: function() {
        var that = this;
        that.router = Router({
            '/index': function() {
                loadRelativePage("/src/html/index.html");
            },
            '/event': function() {
                loadRelativePage("/src/html/event.html");
            },
            '/task': function() {
                loadRelativePage("/src/html/task.html");
            },
            '/track': function() {
                loadRelativePage("/src/html/track.html");
            },
            '/map': function() {
                loadRelativePage("/src/html/map.html");
            },
            '/equipment': function() {
                loadRelativePage("/src/html/none.html");
            },
            '/statistics': function() {
                loadRelativePage("/src/html/none.html");
            },
            '/management': function() {
                loadRelativePage("/src/html/none.html");
            },
            '/news': function() {
                loadRelativePage("/src/html/none.html");
            },
            '/personal': function() {
                loadRelativePage("/src/html/personal.html");
            },
            '/updatepass': function() {
                loadRelativePage("/src/html/forgetPassword.html");
            },
            '/setLogin': function() {
                loadRelativePage("/src/html/setLogin.html");
            },
            '/help': function() {
                loadRelativePage("/src/html/help.html");
            }
        });
        that.router.init('/index');
    },
};