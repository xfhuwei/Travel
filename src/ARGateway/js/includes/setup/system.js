// 加载系统一级后
// 根据页面二级参数展示二级标签页
var tags2 = getUrlParam('tags2');
!tags2 && (tags2 = 'setup');
$('.tags-box>div>div>a').each(function (i, v) {
    if ($(v).attr('data-val').split('-')[1] === tags2) {
        $(v).addClass('active');
    }
});
// console.log(tags2)
$('.main-chenge').load('./includes/setup/system/'+ tags2 +'.html', function (html, msg) {
    if (msg === 'error') {
        $('.setup-system').load('./includes/setup/system/setup.html');
        $('.tags-box>div>div>a').removeClass('active');
        $('.tags-box>div>div>a:first').addClass('active');

    }

    setLangFn(); // 多语言转换

});
