$(document).ready(function() {
    menuListListener();
    initPersonal(); //首次登录进来，进行初始化个人的基本信息
    routerObj.init()
});

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
        if (userBo.profilePhoto != null && userBo.profilePhoto != "") {
            $(".person-img").attr('src', "/cloudlink-core-file/file/getImageBySize?fileId=" + userBo.profilePhoto + "&viewModel=fill&width=500&hight=500");
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
                if (zhugeSwitch == 1) {
                    zhuge.track('点击首页');
                }
            },
            '/event': function() {
                loadRelativePage("/src/html/event.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击事件管理');
                }
            },
            '/task': function() {
                loadRelativePage("/src/html/task.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击任务管理');
                }
            },
            '/track': function() {
                loadRelativePage("/src/html/track.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击巡线记录');
                }
            },
            '/map': function() {
                loadRelativePage("/src/html/map.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击一张图');
                }
            },
            '/equipment': function() {
                loadRelativePage("/src/html/none.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击设备管理');
                }
            },
            '/statistics': function() {
                loadRelativePage("/src/html/none.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击统计分析');
                }
            },
            '/management': function() {
                loadRelativePage("/src/html/management.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击组织结构管理');
                }
            },
            '/removemanager': function() {
                loadRelativePage("/src/html/removemanager.html");
                // if (zhugeSwitch == 1) {
                //     zhuge.track('点击企业管理');
                // }
            },
            '/certification': function() {
                loadRelativePage("/src/html/none.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('企业认证');
                }
            },
            '/managementuser': function() {
                loadRelativePage("/src/html/peoplemanager.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击企业管理');
                }
            },
            '/news': function() {
                loadRelativePage("/src/html/none.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击消息中心');
                }
            },
            '/personal': function() {
                loadRelativePage("/src/html/personal.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击个人资料');
                }
            },
            '/updatepass': function() {
                loadRelativePage("/src/html/forgetPassword.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击修改密码');
                }
            },
            '/setLogin': function() {
                loadRelativePage("/src/html/setLogin.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击登陆设置');
                }
            },
            '/help': function() {
                loadRelativePage("/src/html/help.html");
                if (zhugeSwitch == 1) {
                    zhuge.track('点击帮助中心');
                }
            }
        });
        that.router.init('/index');
    },
};