$(function () {

    // 进入页面 第三级
    var tags3 = getUrlParam('tags3');
    !tags3 && (tags3 = 'upgrade');
    $('.maintain-nav>a').each(function (i, v) {
        if ($(v).attr('data-val').split('-')[2] === tags3) {
            $(v).addClass('active');
            $('.'+ tags3 +'-main').show().siblings().remove();

            eval( tags3 + 'Fn' + '()');

        }
    });

    // 点击标签
    $('.maintain-nav>a').click(function () {
        var tags = $(this).attr('data-val').split('-');
        window.location.href = location.href.split('?')[0] +
            '?tags=' + tags[0] + '&tags2=' + tags[1] + '&tags3=' + tags[2];
    });

    // 升级维护
    function upgradeFn() {

        // 点击重启
        $('#reset-system').click(function () {
            layer.msg('重启');
        });

        // 选择文件
        $('#liulan-file').change(function (eve) {
            if (eve.target.files && eve.target.files.length >= 0) {
                $('#file-name').val(eve.target.files[0].name);
            }
        });

        // 点击升级
        $('#upgrade-btn').click(function () {
            layer.msg('升级');
        });

        // 进度条测试
        var i = 0;
        var timer = setInterval(function () {
            i += 1;
            if (i > 100) {
                clearInterval(timer);
                timer = null;
                return;
            }
            $('.progress>span').css('width', i + '%');
        }, 60);




    }

    // 日志
    function logFn() {

        // 下拉选择框 fixme: 主类型改变的时候，次类型的选项要跟着改变
        var selectDom = $('.from-select');
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

        // 时间日期选择器
        laydate.render({
            elem: '#start-date'
            ,type: 'datetime'
            ,theme: '#0d83f0'
            ,btns: ['now', 'confirm']
        });
        laydate.render({
            elem: '#end-date'
            ,type: 'datetime'
            ,theme: '#0d83f0'
            ,btns: ['now', 'confirm']
        });
        // 查询
        $('#inquire-log').click(function () {
            var startDate = $('#start-date').val();
            var endDate = $('#end-date').val();
            if (!startDate || !endDate) {
                layer.msg('请先选择时间');
                return;
            }
            layer.msg('查询：' + startDate + ' 至 ' + endDate);
        });


        // 点击导出
        $('#derive-log').click(function () {
            var header = {
                time: '时间',
                mainType: '主类型',
                subType: '次类型',
                channelNumber: '通道号',
                user: '本地/远程用户',
                hostAddr: '远程主机地址'
            }
            if (tableToExcel(header, logic.tableData, '日志')) {
                layer.msg('导出成功');
            } else {
                layer.msg('导出失败');
            }
        });


        // 表格逻辑：取数据、分页...
        var logic = {
            tableData: '', // 存储表格数据
            pageSize: 10, // 分页中一页数据的条数
            currPage: 1, // 当前页

            // 初始化
            init: function() {
                logic.getTableDataFn();

            },

            // 获取页面数据
            getTableDataFn: function() {
                $.ajax({
                    type: 'GET',
                    data: '',
                    url: './data/log.json',
                    success: function (res) {
                        console.log(res);
                        if (res.code !== 0) {
                            layer.msg("请求返回码不为0。");
                            return;
                        }
                        if (res.data.length <= 0) {
                            layer.msg("请求返回数据集为空。");
                            return;
                        }

                        logic.tableData = (res.data);
                        logic.pageToolFn();

                    },
                    error: function (err) {
                        console.log(err);
                        layer.msg('请求失败。');
                    }
                });
            },

            // 将获取的页面数据插入表格
            setTableFn: function(data) {
                if (!data) data = [];
                var html = '';
                $.each(data, function (i, v) {
                    html += '<tr>';
                    html += '<td>' + v.number + '</td>';
                    html += '<td>' + v.time + '</td>';
                    html += '<td>' + v.mainType + '</td>';
                    html += '<td>' + v.subType + '</td>';
                    html += '<td>' + v.channelNumber + '</td>';
                    html += '<td>' + v.user + '</td>';
                    html += '<td>' + v.hostAddr + '</td>';
                    html += '</tr>';
                });
                $('.table-body').html(html);

                logic.setScroll();
                $(window).on("resize", logic.setScroll);

            },

            // table 滚动条 和 固定table头部
            setScroll: function() {
                $('.table-box thead th').each(function (i, v) {
                    $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
                });

                var height =  $('.main-chenge').height() - 35 - 70 - 49 - 52; // 表格高度
                $(".table-box").slimScroll({
                    height: height,
                    color: '#0394F9',
                });
            },

            // 创建分页条函数
            pageToolFn: function() {

                var pages = logic.cutPages(logic.pageSize);
                logic.setTableFn(pages[logic.currPage - 1]);

                if ( pages.length < 2) return;

                $("#page").whjPaging({
                    totalSize: logic.tableData.length, // 总条数
                    totalPage: pages.length, // 总页数
                    pageSizeOpt: [{
                        value: 10,
                        text: '10条/页',
                        selected: true
                    }, {
                        value: 15,
                        text: '15条/页'
                    }, {
                        value: 20,
                        text: '20条/页'
                    }, {
                        value: 30,
                        text: '30条/页'
                    }],
                    isShowRefresh: false,
                    confirm: "跳转",
                    skip: "跳转到",
                    callBack: function(currPage, pageSize) {
                        logic.currPage = currPage;
                        logic.pageSize = pageSize;

                        var pages = logic.cutPages(logic.pageSize);
                        logic.setTableFn(pages[logic.currPage - 1]);
                    }
                });

            },
            // 分割数据
            cutPages: function (pageSize) {
                var pages = [];
                $.each(logic.tableData, function (index, item) {
                    var page = Math.floor(index / pageSize);
                    if (!pages[page]) {
                        pages[page] = [];
                    }
                    pages[page].push(item);
                })
                return pages
            },
            // 更新分页插件和表格数据
            updatePagesTableFn: function () {
                var pages = logic.cutPages(logic.pageSize);
                logic.setTableFn(pages[logic.currPage - 1]);
                //设置分页插件显示
                $("#page").whjPaging("setPage", {
                    currPage: logic.currPage,
                    totalPage: pages.length,
                    totalSize: logic.tableData.length
                });
            }


        }
        logic.init();





    }

});