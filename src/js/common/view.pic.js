//在一个ul列表中查看大图，大图路径存放在一个属性data-original中,运用在jquery中
var viewPicObj = (function() {

    var view = $('<div class="viewWindow"></div>');
    var imgMain = $('<div class="viewMain"></div>');
    var img = $('<img src="" alt="">');
    var closed = $('<div class="viewClose"><i>&times;</i></div>');
    var prev = $('<div class="viewLeft">&lt;</div>');
    var next = $('<div class="viewRight">&gt;</div>');

    var index = null;
    var totalLeng = null;
    var src = null;
    var container = null;
    var viewH = null;
    var viewW = null;
    var flag = null;

    $("body").on("click", ".viewClose", function() {　　　　
        closeView();
    });
    $("body").on("click", ".viewLeft", function() {　　　　
        prevView();
    });
    $("body").on("click", ".viewRight", function() {　　　　
        nextView();
    });

    //打开视图窗口
    var openView = function() {
        flag = true;
        index = 0;
        $("body").addClass("viewer-open");
        $("body").append(view);
        view.append(imgMain);
        imgMain.append(img);
        view.append(closed);
        view.append(prev);
        view.append(next);
        prev.show();
        next.show();
        viewH = view.height();
        viewW = view.width();
        img.css({
            "width": 'auto',
            "height": 'auto'
        });
    };
    //关闭视图窗口
    var closeView = function() {
        $("body").removeClass("viewer-open");
        view.remove();
    };
    //查看上一张
    var prevView = function() {
        if (flag == true) {
            flag = false;
            img.css({
                "width": 'auto',
                "height": 'auto'
            });
            next.show();
            if (index == 1) {
                prev.hide();
            }
            src = container.find("li").eq(index - 1).find("img").attr("data-original");
            img.attr("src", src);
            index--;
        }
    };
    //查看下一张
    var nextView = function() {
        if (flag == true) {
            flag = false;
            img.css({
                "width": 'auto',
                "height": 'auto'
            });
            prev.show();
            if (index == (totalLeng - 2)) {
                next.hide();
            }
            src = container.find("li").eq(index + 1).find("img").attr("data-original");
            img.attr("src", src);
            index++;
        }
    };
    //计算图片的宽高，来确定它显示的位置
    var imgLocation = function() {
        img.load(function() {
            flag = true;
            var height = img.height();
            var width = img.width();

            if (height > viewH) {
                img.height(viewH);
                height = viewH;
                width = img.width();
            }
            if (width > viewW) {
                img.width(viewW);
                width = viewW;
                height = img.height();
            }
            img.css({
                "margin-top": -height / 2 + "px",
                "margin-left": -width / 2 + "px"
            });
        });
    };
    //查看图片
    var viewPic = function(e) {
        openView();
        index = $(e).closest("li").index();
        container = $(e).closest("ul");
        totalLeng = container.find("li").length;

        src = $(e).attr("data-original");
        img.attr("src", src);

        if (index == 0) {
            prev.hide();
        }
        if (index == (totalLeng - 1)) {
            next.hide();
        }
        flag = false;
        imgLocation();
    };
    return {
        viewPic: viewPic,
    }
})();