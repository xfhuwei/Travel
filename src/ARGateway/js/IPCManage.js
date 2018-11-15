$(function(){

    logic.init();

});

// 面向对象？逻辑操作
var logic = {
    tableData: '', // 存储表格数据
    pageSize: 5, // 分页中一页数据的条数
    currPage: 1, // 当前页

    // 初始化
    init: function() {
        logic.getTableDataFn();

        // 批量删除
        $('#remove-btn').click(function () {
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
            url: './data/IPCManage.json',
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
            html += '<td>' + v.aisleNumber + '</td>';
            html += '<td>' + v.aisleName + '</td>';
            html += '<td>' + v.ip + '</td>';
            html += '<td>' + v.userName + '</td>';
            html += '<td>' + v.password + '</td>';
            html += '<td>' + v.port + '</td>';
            html += '<td>' + v.manufacturers + '</td>';
            html += '<td>' + v.longitude + '</td>';
            html += '<td>' + v.latitude + '</td>';
            html += '<td>' + v.height + '</td>';
            html += '<td>';
            html += '<a title="删除" class="remove-item-a fa fa-trash-o"></a>';
            html += '<a title="编辑" class="fa fa-trash-o"></a>';
            html += '<a title="网页网管" class="fa fa-trash-o"></a>';
            html += '</td></tr>';
        });
        $('.table-body').html(html);

        $(".check-th>i").removeClass('fa-check-square-o').addClass('not-check');

        logic.setScroll();
        $(window).on("resize", logic.setScroll);

        logic.setCheckFn();

        // 点击删除一行
        $('.remove-item-a').click(function () {
            var index = logic.pageSize * (logic.currPage - 1) + $(this).parents('tr').index();
            logic.tableData.splice(index, 1);
            $(this).parents('tr').remove();

            var pages = logic.cutPages(logic.pageSize);
            if (!pages[logic.currPage - 1]) { // 当此页已经删到没有数据时退一页
                logic.currPage --;
            }
            logic.setTableFn(pages[logic.currPage - 1]);

            logic.updatePagesTableFn();
        });

    },

    // table 滚动条 和 固定table头部
    setScroll: function() {
        $('.table-box thead th').each(function (i, v) {
            $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
        });

        var height =  $('body').height() - 60 - 70 - 58;
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

        $("#page").whjPaging({
            totalSize: logic.tableData.length, // 总条数
            totalPage: pages.length, // 总页数
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