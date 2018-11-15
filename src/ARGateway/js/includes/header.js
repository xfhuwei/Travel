/**
 *  通用头部 js
 */


$(function () {

    // 头部标签加class
    var href = window.location.href;
    $('.header .nav>a').each(function (i, v) {
        if (href.indexOf($(v).attr('data-val')) !== -1) {
            $(v).addClass('active');
        }
    });

    // 鼠标移入用户显示下拉框
    $('.header .right').hover(function () {
        $('.hide-box').stop().slideDown();
    }, function () {
        $('.hide-box').stop().slideUp();
    });

    // 注销函数
    function logoutFn() {
        var params = {
            Cmd: "Logout",
            Content: {
                UserName: username
            }
        };
        AjaxFn('POST', '注销', api.login.Logout, params, function (res) {
            // 删除在sessionStorage中的用户名、token
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            window.location.href = './login.html';
        });
    }
    // 退出系统
    $('#exit-a').click(function() {
        layer.confirm('您确定要退出系统吗？', {
            btn: ['确定','取消']
        }, function(){
            logoutFn(); // 注销请求
        });
    });

    // 重启系统
    $('#reset-a').click(function() {
        layer.confirm('您确定要重启系统吗？', {
            btn: ['确定','取消']
        }, function(){
            layer.msg('TODO：重启系统？');
        });
    });

});