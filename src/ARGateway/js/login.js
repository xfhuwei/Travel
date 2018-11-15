$(function(){

    // 点击登录
    $('#login').click(function (eve) {
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        console.log(username, password);

        rememberUP(); // 记住密码

        // 登录请求
        var params = {
            Cmd: "Login",
            Content: {
                UserName: username,
                Password: password
            }
        };
        AjaxFn('POST', '登录', api.login.Login, params, function (res) {
            // 把用户名 和 返回的token保存在sessionStorage中
            sessionStorage.setItem('token', res.Content.Token);
            sessionStorage.setItem('username', username);
            window.location.href = './livePreview.html';
        });

    });



    // 记住密码功能
    /*
     * 字符串加密
     * 用javascript对字符串进行加密，应用于参数传递等。
     * 默认加密密钥为kb1234，使用者可自定义修改。
     * 注意加密密钥应和解密密钥相同。
     * 算法来自于互联网
     * 使用方法：
     * 加密
     * var code = kbt.encrypt('我爱北京天安门');
     * alert(code);
     * 解密
     * var str =  kbt.decrypt(code);
     * alert(str);
     */
    var kbt = (function () {
        var that = {};

        function encrypt(str, pwd) {
            if(str == '') {
                return '';
            }
            str = encodeURIComponent(str);
            if(!pwd || pwd == '') {
                pwd = 'GoSun';
            }
            pwd = encodeURIComponent(pwd);
            if(pwd == '' || pwd.length <= 0) {
                return '';
            }
            var prand = '';
            for(var i = 0, len = pwd.length; i < len; i += 1) {
                prand += pwd.charCodeAt(i).toString();
            }
            var sPos = Math.floor(prand.length / 5);
            var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
                prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
            var incr = Math.ceil(pwd.length / 2);
            var modu = Math.pow(2, 31) - 1;
            if(mult < 2) {
                return '';
            }
            var salt = Math.round(Math.random() * 1000000000) % 100000000;
            prand += salt;
            while(prand.length > 10) {
                prand = (parseInt(prand.substring(0, 10)) +
                    parseInt(prand.substring(10, prand.length))).toString();
            }
            prand = (mult * prand + incr) % modu;
            var encChr = '';
            var encStr = '';
            for(var i = 0, len = str.length; i < len; i += 1) {
                encChr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
                if(encChr < 16) {
                    encStr += '0' + encChr.toString(16);
                }else{
                    encStr += encChr.toString(16);
                }
                prand = (mult * prand + incr) % modu;
            }
            salt = salt.toString(16);
            while(salt.length < 8) {
                salt = "0" + salt;
            }
            encStr += salt;
            return encStr;
        }

        function decrypt(str, pwd)
        {
            if(str == ''){
                return '';
            }
            if(!pwd || pwd == ''){
                pwd = 'GoSun';
            }
            pwd = encodeURIComponent(pwd);
            if(str == undefined || str.length < 8) {
                return '';
            }
            if(pwd == undefined || pwd.length <= 0) {
                return '';
            }
            var prand = '';
            for(var i = 0, len = pwd.length; i < len; i += 1) {
                prand += pwd.charCodeAt(i).toString();
            }
            var sPos = Math.floor(prand.length / 5);
            var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
                prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
            var incr = Math.round(pwd.length / 2);
            var modu = Math.pow(2, 31) - 1;
            var salt = parseInt(str.substring(str.length - 8, str.length), 16);
            str = str.substring(0, str.length - 8);
            prand += salt;
            while(prand.length > 10) {
                prand = (parseInt(prand.substring(0, 10)) +
                    parseInt(prand.substring(10, prand.length))).toString();
            }
            prand = (mult * prand + incr) % modu;
            var encChr = '';
            var encStr = '';
            for(var i = 0, len = str.length; i < len; i += 2) {
                encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
                encStr += String.fromCharCode(encChr);
                prand = (mult * prand + incr) % modu;
            }
            return decodeURIComponent(encStr);
        }

        that.encrypt = encrypt;
        that.decrypt = decrypt;
        return that;
    })();
    function setCookie(name, value, timeout) {
        var d = new Date();
        d.setDate(d.getDate() + timeout);
        document.cookie = name + '=' + value + ';expires=' + d;
    }
    function getCookie(name) {
        var arr = document.cookie.split('; ');
        for ( var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('='); //['abc','cba']
            if (arr2[0] == name) {
                return arr2[1];
                // console.log(arr2[1]);
            }
        }
        return '';
    }
    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
    // 设置记住密码的 localStorage判定和cookie内容，点击登录时需要使用此函数去记住密码
    function rememberUP() {
        if($('.remember-box').hasClass('active')){
            //设置cookie 并一天后清除
            localStorage.setItem('rememberMe', 'true');
            var code = kbt.encrypt($('input[name="password"]').val());
            setCookie("username", $('input[name="username"]').val(), 7);
            setCookie("password", code, 7);
        }else{
            localStorage.removeItem('rememberMe');
            delCookie("username");
            delCookie("password");
        }
    }
    // 点击记住密码
    $('.remember-box').click(function (eve) {
        $(this).toggleClass('active');
        rememberUP();
    });
    // 打开页面时判断是否有记住密码
    (function(){
        var rememberMe = localStorage.getItem('rememberMe');
        if(rememberMe === 'true'){
            $('.remember-box').addClass('active');
        }else{
            $('.remember-box').removeClass('active');
        }
        //获取cookie
        var userName = getCookie("username");
        if (userName) {
            //设置cookie中保存的用户名
            $('input[name="username"]').val(userName);
        }
        var password = getCookie("password");
        if (password) {
            var str =  kbt.decrypt(password);
            $('input[name="password"]').val(str);
        }
    })();


    // 选择语言 中英文切换
    var selectDom = $('#lang-select');
    var selResDom = $('.lang-result');
    selectDom.on('click', '.lang-result' ,function (eve) {
        $('.lang-option-list').stop().slideDown();
    });
    selectDom.on('click', '.lang-option-item' ,function (eve) {
        selResDom
            .attr('data-val', $(this).attr('data-val'))
            .html($(this).html());

        var lang = selResDom.attr('data-val');
        localStorage.setItem('language', lang);
        changeLangFn(lang)

    });
    $('body').click(function (eve) { // 为了关闭
        if (!$(eve.target).hasClass('lang-result')) {
            $('.lang-option-list').hide();
        }
    });



});
