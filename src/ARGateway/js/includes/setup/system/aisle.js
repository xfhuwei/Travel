$(function () {

    // 面向对象？逻辑操作
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

            // 打开导入框
            $('#lead-btn').click(function (eve) {
                eve.stopPropagation();
                $('.lead-modal').fadeIn();
            });
            // 选择文件
            $('#liulan-file').change(function (eve) {
                if (eve.target.files && eve.target.files.length > 0) {
                    $('#file-name').val(eve.target.files[0].name);
                }
            });
            // 导入点击确定
            $('#lead-confirm').click(function (eve) {

                if (!$('#liulan-file')[0].files || $('#liulan-file')[0].files.length <= 0) {
                    layer.msg('请先选择文件。');
                    return;
                }
                var file = $('#liulan-file')[0].files[0];
                layer.msg('导入文件：' + file.name);

            });

            // 打开新增框
            $('#add-btn').click(function (eve) {
                eve.stopPropagation();

                $('.add-modal').attr('data-val', 'add');

                // 置空
                $('.add-modal input').val('');
                var s1 = $($('#protocol-type .option-item')[0]);
                $('#protocol-type .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));

                $('.add-modal').fadeIn();
            });

            // 新增/修改框点击确定提交
            $('#add-confirm').click(function (eve) {

                if ($('.add-modal').attr('data-val') === 'add') {
                    layer.msg('新增：提交保存');
                } else {
                    layer.msg('修改：提交保存');
                }

                var aisleName = $('#from-aisleName').val();
                var ip = $('#from-ip').val();
                var userName = $('#from-userName').val();
                var password = $('#from-password').val();
                var port = $('#from-port').val();
                var manufacturers = $('#from-manufacturers').val();
                var longitude = $('#from-longitude').val();
                var latitude = $('#from-latitude').val();
                var height = $('#from-height').val();
                var protocol = $('#protocol-type .select-result').attr('data-val');


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
                html += '<tr class="ipc-item" data-val="'+ JSON.stringify(v).replace(/"/g, '`') +'">';
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
                if (v.state === '正常') {
                    html += '<td class="w-50" style="color:green">' + v.state + '</td>';
                } else if (v.state === '异常') {
                    html += '<td class="w-50" style="color:red">' + v.state + '</td>';
                } else {
                    html += '<td class="w-50">' + v.state + '</td>';
                }
                html += '<td class="lastTd">';
                html += '<a title="删除" class="remove-item-a"></a>';
                html += '<a title="编辑" class="edit-item-a"></a>';
                html += '<a title="跳转IPC" class="href-item-a"></a>';
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

            // 打开修改框
            $('.edit-item-a').click(function (eve) {
                eve.stopPropagation();

                $('.add-modal').attr('data-val', 'edit');

                var data = $($(eve.target).parents('tr')[0]).attr('data-val');
                data = JSON.parse(data.replace(/`/g, '"'));
                // 插值
                $('#from-aisleName').val(data.aisleName);
                $('#from-ip').val(data.ip);
                $('#from-userName').val(data.userName);
                $('#from-password').val(data.password);
                $('#from-port').val(data.port);
                $('#from-manufacturers').val(data.manufacturers);
                $('#from-longitude').val(data.longitude);
                $('#from-latitude').val(data.latitude);
                $('#from-height').val(data.height);
                var s1 = $($('#protocol-type .option-item')[0]);
                $('#protocol-type .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));
                $('#protocol-type .option-item').each(function (i, v) {
                    if ($(v).attr('data-val') == data.protocol) {
                        $('#protocol-type .select-result').text($(v).text())
                            .attr('data-val', $(v).attr('data-val'));
                    }
                });


                $('.add-modal').fadeIn();
            });

        },

        // table 滚动条 和 固定table头部
        setScroll: function() {
            $('.table-box thead th').each(function (i, v) {
                $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
            });

            var height =  $('.main-chenge').height() - 54 - 62;
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

    // 新增、修改相关
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

});