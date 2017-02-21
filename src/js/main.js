$(document).ready(function(){
    resizeMain();
    menuListListener();
});
var resizeMain = function(){
     document.getElementById("page-wrapper").style.height = document.documentElement.clientHeight-55 + 'px';
}
window.onresize = function(){
    resizeMain();
}
var menuListListener = function(){
    $(".nav.navbar-nav.side-nav>li").on("click", function(){
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
}
var loadRelativePage = function(_url){
    document.getElementById("page-wrapper").src=_url;
}
