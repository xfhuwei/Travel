// 设置一屏高度
function sizeFn() { // 放在外面让其他js也可调用
    $('.system-setup-container').height($('body').height() - 50);
    $('.main-chenge').css('width', $('body').width() - 231 + 'px');
}

$(function(){

    sizeFn();
    $(window).on("resize", sizeFn);

    // 根据页面参数展示标签页
    var tags = getUrlParam('tags');
    !tags && (tags = 'local');
    $('.tags-box>div').each(function (i, v) {
        if ($(v).attr('data-val') === tags) {
            $(v).addClass('active');
        }
    });
    $('.main-chenge').load('./includes/setup/'+ tags +'.html', function (html, msg) {
        if (msg === 'error') {
            $('.main-chenge').load('./includes/setup/local.html');
            $('.tags-box>div').removeClass('active');
            $('.tags-box>div:first').addClass('active');
        }

        setLangFn();
    });

    // 点击标签
    $('.tags-box>div').click(function () {
        var tags = $(this).attr('data-val');
        window.location.href = location.href.split('?')[0] + '?tags=' + tags;
    });

    // 点击二级标签
    $('.tags-box>div>div>a').click(function (e) {
        e.stopPropagation();
        var tags = $(this).attr('data-val').split('-');
        console.log(location.href.split('?')[0] + '?tags=' + tags[0] + '&tags2=' + tags[1])
        window.location.href = location.href.split('?')[0] + '?tags=' + tags[0] + '&tags2=' + tags[1];
    });

    // 移入标签
    $('.tags-box>div:not(.active)').hover(function () {
        $(this).children('div').stop().slideDown();
    }, function () {
        $(this).children('div').stop().slideUp();
    });

});
