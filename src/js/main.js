$(document).ready(function() {
    resizeMain();
    menuListListener();
    initPersonal(); //首次登录进来，进行初始化个人的基本信息
});
var resizeMain = function() {
    document.getElementById("page-wrapper").style.height = document.documentElement.clientHeight - 55 + 'px';
}
window.onresize = function() {
    resizeMain();
}
var menuListListener = function() {
    $(".nav.navbar-nav.side-nav>li").on("click", function() {
        $('.nav.navbar-nav.side-nav').find('li').each(function() {
            $(this).removeClass('active');
        });
        $(this).addClass("avtive");
        var menuid = $(this).attr("menuid");
        switch (menuid) {
            case 'index':
                loadRelativePage("/src/html/index.html");
                break;
            case 'event':
                loadRelativePage("/src/html/event.html");
                break;
            case 'task':
                loadRelativePage("/src/html/task.html");
                break;
            case 'insrecord':
                loadRelativePage("/src/html/track.html");
                break;
            default:
                loadRelativePage("/src/html/none.html");
                break;
        }
    });
    $(".dropdown-menu.alert-dropdown>li").on("click", function() {
        var menuid = $(this).attr("menuid");
        switch (menuid) {
            case 'personal':
                loadRelativePage("/src/html/personal.html");
                break;
            case 'updatepass':
                loadRelativePage("/src/html/forgetPassword.html");
                break;
            case 'setLogin':
                loadRelativePage("/src/html/setLogin.html");
                break;
        }
    });
    $(".nav.navbar-right.top-nav>li").on("click", function() {
        var menuid = $(this).attr("menuid");
        switch (menuid) {
            case 'help':
                loadRelativePage("/src/html/help.html");
                break;
            case 'signOut':
                lsObj.clearAll();
                location.href = 'login.html';
                break;
        }
    });
}
var loadRelativePage = function(_url) {
        document.getElementById("page-wrapper").src = _url;
    }
    /*进行个人信息初始化 */
var initPersonal = function() {
    var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    $(".userName").text(userBo.userName);
    $(".new_company").html("");
    var current = userBo.enterpriseName + '<img src="/src/images/main/refresh.png">';
    $(".new_company").append(current);
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