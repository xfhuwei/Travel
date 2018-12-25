$(function () {

    // 进入页面 第三级
    var tags3 = getUrlParam('tags3');
    !tags3 && (tags3 = 'base');
    $('.setup-nav>a').each(function (i, v) {
        if ($(v).attr('data-val').split('-')[2] === tags3) {
            $(v).addClass('active');
            $('.'+ tags3 +'-main').show().siblings().remove();

            eval( tags3 + 'Fn' + '()');

        }
    });

    // 点击标签
    $('.setup-nav>a').click(function () {
        var tags = $(this).attr('data-val').split('-');
        window.location.href = location.href.split('?')[0] +
            '?tags=' + tags[0] + '&tags2=' + tags[1] + '&tags3=' + tags[2];
    });

    // 基本信息
    function baseFn() {

        // 请求获取基本信息
        var params = {
            Cmd: "GetBasicInfo"
        };
        AjaxFn('GET', '获取设备基本信息', api.systemSetup.GetBasicInfo, params, function (res) {
            var data = res.Content;
            $('#from-name').val(data.Name);
            $('#from-number').val();
            $('#from-type').val(data.DevModel);
            $('#from-serial').val(data.DevSerial);
            $('#from-control').val(data.MasterVersion);
            $('#from-code').val();
            $('#from-web').val(data.WebVersion);
            $('#from-plugin').val(data.OcxVersion);
            $('#from-gallery').val();
        });

        // 保存
        $('#base-save').click(function () {
            var Name = $('#from-name').val();
            var number = $('#from-number').val();
            var DevModel = $('#from-type').val();
            var DevSerial = $('#from-serial').val();
            var MasterVersion = $('#from-control').val();
            var code = $('#from-code').val();
            var WebVersion = $('#from-web').val();
            var OcxVersion = $('#from-plugin').val();
            var gallery = $('#from-gallery').val();

            var params = {
                Cmd: "SetBasicInfo",
                Content: {
                    Name: Name,
                    DevModel: DevModel,
                    DevSerial: DevSerial,
                    MasterVersion: MasterVersion,
                    WebVersion: WebVersion,
                    OcxVersion: OcxVersion
                }
            };
            AjaxFn('POST', '设置设备基本信息', api.systemSetup.SetBasicInfo, params, function (res) {
                // 做点什么？
            });

        });

    }

    // 时间配置
    function timeFn() {

        // 时区选择
        (function timeZoneFn() {
            // 获取时区 (获取自定义的json数据)
            $.getJSON("./data/useful/timezone.json",function(res){
                // console.log(res);
                var html = '';
                $.each(res.data, function (i, v) {
                    html += '<p class="option-item" data-val="'+ v.value +'">'+ v.desc +'</p>';
                });
                $('#time-zone .option-list').html(html);



            });
            // 选择时区事件
            var selectDom = $('#time-zone');
            selectDom.on('click', '.select-result' ,function (eve) {
                $(this).next().stop().slideDown();
            });
            selectDom.on('click', '.option-item' ,function (eve) {
                $(this).parent().prev()
                    .attr('data-val', $(this).attr('data-val'))
                    .html($(this).html());
            });
            $('body').click(function (eve) { // 为了关闭
                if (!$(eve.target).hasClass('select-result')) {
                    $('.option-list').hide();
                }
            });
        })();

        // 请求获取时间配置
        var params = {
            Cmd: "GetTimeCfg"
        };
        AjaxFn('GET', '获取时间配置', api.systemSetup.GetTimeCfg, params, function (res) {
            var data = res.Content;
            $('#time-zone .option-item').each(function (i, v) {
                if ($(v).attr('data-val') == data.Zone) {
                    $('#time-zone .select-result').attr('data-val', data.Zone).text($(v).text());
                }
            });
            $('.timing-radio[data-val="'+ data.TimingMode +'"]').addClass('active');
            $('#from-server').val(data.NTP.Address);
            $('#from-ntpport').val(data.NTP.Port);
            $('#from-interval').val(data.NTP.TimingInterval);
            $('#from-devtime').val(data.Manual);
            $('#set-time').val(data.Manual);
        });

        // 时间日期选择器
        laydate.render({
            elem: '#set-time'
            ,value: '1994-05-05 05:05:05' // 初始赋值
            ,type: 'datetime'
            ,theme: '#0d83f0'
            ,btns: ['now', 'confirm']
        });
        // 与计算机时间同步
        var syncTimer = null;
        $('#loacl-sync').click(function () {
           $(this).toggleClass('active');
           if ($(this).hasClass('active')) {
               var $dom = $('#set-time');
               $dom.val( formatDate() );
               syncTimer = setInterval(function () {
                   $dom.val( formatDate() );
               }, 1000);
           } else {
               clearInterval(syncTimer);
               syncTimer = null;
           }
        });

        // 选择校时方式
        $('.timing-radio').click(function () {
            $('.timing-radio').removeClass('active');
            $(this).addClass('active');
            $('#time-save').attr('data-val', $(this).attr('data-val'));
        });

        // 保存
        $('#time-save').click(function () {

            var type = $(this).attr('data-val');
            var timezone = $('#time-zone .select-result').attr('data-val');
            var handTime = $('#set-time').val();
            var server = $('#from-server').val();
            var ntpport = $('#from-ntpport').val();
            var interval = $('#from-interval').val();

            var params = {
                Cmd: "SetTimeCfg",
                Content: {
                    Zone: timezone,
                    TimingMode: type,
                    Manual: handTime,
                    NTP: {
                        Address: server,
                        Port: ntpport,
                        TimingInterval: interval
                    }
                }
            };
            AjaxFn('POST', '设置时间配置', api.systemSetup.SetTimeCfg, params, function (res) {
                // 做点什么？
            });

        });


    }

});