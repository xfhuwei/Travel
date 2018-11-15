$(function () {

    // 进入页面 第三级
    var tags3 = getUrlParam('tags3');
    !tags3 && (tags3 = 'manage');
    $('.user-nav>a').each(function (i, v) {
        if ($(v).attr('data-val').split('-')[2] === tags3) {
            $(v).addClass('active');
            $('.'+ tags3 +'-main').show().siblings().remove();

            eval( tags3 + 'Fn' + '()');

        }
    });

    // 点击标签
    $('.user-nav>a').click(function () {
        var tags = $(this).attr('data-val').split('-');
        window.location.href = location.href.split('?')[0] +
            '?tags=' + tags[0] + '&tags2=' + tags[1] + '&tags3=' + tags[2];
    });

    // 用户管理
    function manageFn() {

        // 下拉选择框
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

        /* 多选框 */
        var panelDom = $('.select-panel');
        // 溢出滚动条
        panelDom.find('.panel-list').slimScroll({
            height: panelDom.find('.panel-list').height(),
            color: '#0394F9',
        });
        // 全部分配
        panelDom.on('click', '.all-checked' ,function (eve) {
            $('.panel-yixuan').append($('.panel-kexuan').html());
            $('.panel-kexuan').html('');
        });
        // 全部删除
        panelDom.on('click', '.all-checkout' ,function (eve) {
            $('.panel-kexuan').append($('.panel-yixuan').html());
            $('.panel-yixuan').html('');
        });
        // 双击选择单选
        panelDom.on('dblclick', '.panel-item' ,function (eve) {
            var item = $(this).clone();
            $(this).parents('.options-box').siblings('.options-box')
                .find('.panel-list').prepend(item);
            $(this).remove();
        });


        // 表格逻辑
        var logic = {
            tableData: '', // 存储表格数据
            pageSize: 10, // 分页中一页数据的条数
            currPage: 1, // 当前页

            // 初始化
            init: function() {
                logic.getTableDataFn();

                // 批量删除
                $('#remove-btn').click(function () {

                    if ($('.check-i.fa-check-square-o').length <= 0) {
                        layer.msg('您没有选中任何一条记录。');
                        return;
                    }

                    //询问框
                    layer.confirm('您确定要删除选中的记录吗？', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        $('.check-i.fa-check-square-o').each(function (i, v) {
                            var index = logic.pageSize * (logic.currPage - 1) + $(v).parents('tr').index();
                            logic.tableData.splice(index, 1);
                            $(v).parents('tr').remove();
                        });
                        var pages = logic.cutPages(logic.pageSize);
                        if (!pages[logic.currPage - 1]) { // 当此页已经删到没有数据时退一页
                            logic.currPage --;
                        }
                        logic.setTableFn(pages[logic.currPage - 1]);

                        logic.updatePagesTableFn();

                        layer.msg('删除成功');
                    });
                });

                // 关闭模态框
                $('.close-btn, .cancel').click(function () {
                    $('.modal-box').hide();
                });

                // 打开新增框
                $('#add-btn').click(function (eve) {
                    eve.stopPropagation();
                    $('.add-modal').fadeIn();
                });

            },

            // 获取页面数据
            getTableDataFn: function() {
                $.ajax({
                    type: 'GET',
                    data: '',
                    url: './data/manage.json',
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
                    html += '<tr class="ipc-item">';
                    html += '<td class="w-40"><i class="check-i not-check fa "></i></td>';
                    html += '<td>' + v.userName + '</td>';
                    html += '<td>' + v.password + '</td>';
                    html += '<td class="lastTd">';
                    html += '<a title="删除" class="remove-item-a"></a>';
                    html += '<a title="修改权限" class="limits-item-a"></a>';
                    html += '<a title="修改密码" class="password-item-a"></a>';
                    html += '</td></tr>';
                });
                $('.table-body').html(html);

                $(".check-th>i").removeClass('fa-check-square-o').addClass('not-check');

                logic.setScroll();
                $(window).on("resize", logic.setScroll);

                logic.setCheckFn();

                // 点击删除一行
                $('.remove-item-a').click(function () {
                    var $this = $(this);
                    //询问框
                    layer.confirm('您确定要删除这一条记录吗？', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        var index = logic.pageSize * (logic.currPage - 1) + $this.parents('tr').index();
                        logic.tableData.splice(index, 1);
                        $this.parents('tr').remove();

                        var pages = logic.cutPages(logic.pageSize);
                        if (!pages[logic.currPage - 1]) { // 当此页已经删到没有数据时退一页
                            logic.currPage --;
                        }
                        logic.setTableFn(pages[logic.currPage - 1]);

                        logic.updatePagesTableFn();

                        layer.msg('删除成功');
                    });
                });

                // 打开修改权限框
                $('.limits-item-a').click(function (eve) {
                    eve.stopPropagation();
                    $('.limits-modal').fadeIn();
                });

                // 打开修改密码框
                $('.password-item-a').click(function (eve) {
                    eve.stopPropagation();
                    $('.password-modal').fadeIn();
                });

            },

            // table 滚动条 和 固定table头部
            setScroll: function() {
                $('.table-box thead th').each(function (i, v) {
                    $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
                });

                var height =  $('.main-chenge').height() - 35 - 70 - 62;
                $(".table-box").slimScroll({
                    height: height,
                    color: '#0394F9',
                });
            },

            // 全选 、 单个选择
            setCheckFn: function() {
                // 全选
                $(".check-th").unbind('click').click(function () {
                    var tar = $(this).children('i');
                    if (tar.hasClass('not-check')) {
                        $('.not-check').removeClass('not-check').addClass('fa-check-square-o');
                    } else {
                        $('.fa-check-square-o').removeClass('fa-check-square-o').addClass('not-check');
                    }
                });

                // 单个选择
                $('.ipc-item').unbind('click').click(function (eve) {
                    if (eve.target.nodeName === "A") return;

                    var tar = $(this).find('td:first i');
                    if (tar.hasClass('not-check')) {
                        tar.removeClass('not-check').addClass('fa-check-square-o');
                    } else {
                        tar.removeClass('fa-check-square-o').addClass('not-check');
                    }

                    var pd = true;
                    $('.check-i').each(function (i, v) {
                        if ($(v).hasClass('not-check')) {
                            pd = false;
                        }
                    });
                    if (pd) {
                        $(".check-th>i").removeClass('not-check').addClass('fa-check-square-o');
                    } else {
                        $(".check-th>i").removeClass('fa-check-square-o').addClass('not-check');
                    }

                });
            },

            // 创建分页条函数
            pageToolFn: function() {

                var pages = logic.cutPages(logic.pageSize);
                logic.setTableFn(pages[logic.currPage - 1]);

                if ( pages.length < 2) return;

                $("#manage-page").whjPaging({
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
                $("#manage-page").whjPaging("setPage", {
                    currPage: logic.currPage,
                    totalPage: pages.length,
                    totalSize: logic.tableData.length
                });
            }


        }
        logic.init();

    }

    // 在线用户
    function onlineFn() {

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
                    url: './data/online.json',
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
                    html += '<td>' + v.userName + '</td>';
                    html += '<td>' + v.userType + '</td>';
                    html += '<td>' + v.ip + '</td>';
                    html += '<td>' + v.userHandleTime + '</td>';
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

                var height =  $('.main-chenge').height() - 35 - 70 - 52; // 表格高度
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

                $("#online-page").whjPaging({
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
                $("#online-page").whjPaging("setPage", {
                    currPage: logic.currPage,
                    totalPage: pages.length,
                    totalSize: logic.tableData.length
                });
            }


        }
        logic.init();





    }

});