// 判断有无登录
var token = sessionStorage.getItem('token');
var username = sessionStorage.getItem('username');
if (!token && location.href.indexOf('login') === -1) {
    window.location.href = './login.html';
}


// 引用头部
$('#ar-header').load('./includes/header.html', function() {
    setLangFn()
});


// 中英文语言切换
var langData;
function changeLangFn(lang) {
    if (!lang) {
        lang = 'zh'
    }
    $("[data-localize]").localize("text", {
        pathPrefix: "quote/language/lang",
        language: lang
        ,callback: function(data, defaultCallback){
            defaultCallback(data);
            // console.log(data)
            $("[data-localizeTitle]").each(function (i, v) {
                var title = eval( 'data.' + $(v).attr('data-localizeTitle') );
                $(v).attr('title', title);
            });
            langData = data;
        }
    });

}
function setLangFn() {
    var lang = localStorage.getItem('language');
    if (lang) {
        changeLangFn(lang);
        $('.lang-result')
            .attr('data-val', lang)
            .html($('.lang-option-item[data-val="'+ lang +'"]').html());
    } else {
        localStorage.setItem('language', 'zh');
    }
}
$(function () {
    setLangFn();
});


//获取url中指定名称的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

// 自定义格式化时间
function formatDate(time, format) {
    if (!time) {
        time = new Date()
    }
    if (!format) {
        format = 'YY-MM-DD hh:mm:ss'
    }
    var date = new Date(time)

    var year = date.getFullYear(),
        month = date.getMonth() + 1, //月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds()

    // 开个长度为10的数组 格式为 00 01 02 03。为了不满10的数前面补0的骚操作
    // 不兼容ie8
    // var preArr = Array.apply(null, Array(10)).map(function(elem, index) {
    //     return '0' + index
    // })
    var preArr = ['00','01','02','03','04','05','06','07','08','09']

    var newTime = format
        .replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec)

    return newTime
}


/**
 *  导出 .csv excel表格文件
 *  params:
 *      header： 表头、{xxx: xxx}
 *      jsonData: 表体数据、[{xxx: xxx}, ...]、键名与表头对应
 *      name: 导出的文件名
 * */
function tableToExcel(header, jsonData, name){
    //列标题
    if (!header) {
        return false;
    }
    // 表体
    !jsonData && (jsonData = []);
    // 导出的文件名
    if (!name) {
        name = 'json数据表.csv';
    } else {
        name += '.csv'
    }

    try {

        var arr = [];
        var head = '';
        $.each(jsonData, function (i, v) {
            var s = '';
            $.each(header, function (ii, vv) {
                if (i === 0) {
                    head += vv + '\t,';
                }
                s += v[ii] + '\t,';
            });
            arr.push(s);
        });
        arr.unshift(head);
        var str = arr.join('\n');

        if (window.navigator.msSaveOrOpenBlob) {
            // if 浏览器是 IE
            var blob = new Blob([decodeURIComponent(encodeURI('\ufeff' + str))],{
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, name);
        }else{
            //encodeURIComponent解决中文乱码
            var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
            //通过创建a标签实现
            var link = document.createElement("a");
            link.href = uri;
            //对下载的文件命名
            link.download =  name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        return true;
    } catch (e) {
        return false;
    }

}


/**
 * ajax 请求
 * 请求地址只有一个、功能只是根据参数的变化而变化
 */
function AjaxFn(type, name, url, params, succFn) {
    var url = url? url: 'arApi';
    if (name !== '登录') {
        params.Token = token; // 所有请求默认加上 Content.token 参数，请求登录除外
    }
    params = JSON.stringify(params);
    $.ajax({
        type: type? type: 'GET',
        url: url,
        data: {data: params},
        dataType: 'json',
        success: function (res) {
            console.log(res);
            if (res.Message) {
                layer.msg(res.Message); // 返回的提示
            }
            if (res.Result === 0) {
                succFn(res); // 请求成功后的操作
            }
        },
        error: function (err){
            var msg = name? '请求'+ name + '失败': '请求失败';
            layer.msg(msg);
        }
    });
}
