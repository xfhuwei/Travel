$(function () {

  // 新增、修改相关
  // 下拉选择框
  var selectDom = $('.from-select');
  selectDom.on('click', '.select-result', function (eve) {
    $(this).next().stop().slideDown();
  });
  selectDom.on('click', '.option-item', function (eve) {
    $(this).parent().prev()
      .attr('data-val', $(this).attr('data-val'))
      .html($(this).html());
  });
  $('body').click(function (eve) { // 为了关闭
    if (!$(eve.target).hasClass('select-result')) {
      $('.option-list').hide();
    }
  });

  // 面向对象？逻辑操作
  var logic = {
    tableData: '', // 存储表格数据
    total: 0, // 总条数
    pageSize: 20, // 分页中一页数据的条数
    currPage: 1, // 当前页

    // 初始化
    init: function () {
      logic.pageToolFn();
      logic.getTableDataFn();

      // 批量删除
      $('#remove-btn').click(function () {

        if ($('.check-i.fa-check-square-o').length <= 0) {
          layer.msg('您没有选中任何一条记录。');
          return;
        }

        //询问框
        layer.confirm('您确定要删除选中的记录吗？', {
          btn: ['确定', '取消'] //按钮
        }, function () {
          var ChannelArr = [];
          $('.check-i.fa-check-square-o').each(function (i, v) {
            var data = JSON.parse($($(v).parents('tr')[0]).attr('data-val').replace(/`/g, '"'))
            ChannelArr.push( { Channel: data.Channel } );
          });
          logic.deleteFn(ChannelArr);
        });
      });

      // 关闭模态框
      $('.close-btn, .cancel').click(function () {
        $('.modal-box').hide();
      });

      // 点击导出
      $('#derive-btn').click(function () {
        var header = {
          Channel: '通道号',
          ChanName: '通道名称',
          IP: 'IP地址',
          UserName: '用户名',
          PassWord: '密码',
          Port: '端口',
          ProtocolType: '厂家',
          Manufacturer: '经度',
          Longitude: '纬度',
          Latitude: '安装高度',
          Altitude: '状态'
        }
        if (tableToExcel(header, logic.tableData, 'IPC列表')) {
          layer.msg('导出成功');
        } else {
          layer.msg('导出失败');
        }
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

        $('.add-modal').attr('data-val', 'add').find('.modal-title').text('新增');

        // 置空
        $('.add-modal').attr('data-Channel', '');
        $('.add-modal input').val('');
        var s1 = $($('#protocol-type .option-item')[0]);
        $('#protocol-type .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));

        $('.add-modal').fadeIn();
      });

      // 新增/修改框点击确定提交
      $('#add-confirm').click(function (eve) {

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


        var dataArr = {
          ChanName: aisleName,
          IP: ip,
          UserName: userName,
          PassWord: password,
          Port: port,
          ProtocolType: protocol,
          Manufacturer: manufacturers,
          Longitude: longitude,
          Latitude: latitude,
          Altitude: height
        }
        if ($('.add-modal').attr('data-val') === 'add') {

          logic.addFn([dataArr]); // 新增

        } else {

          dataArr.Channel = $('.add-modal').attr('data-Channel');
          logic.editFn(dataArr); // 修改

        }



      });



    },

    // 获取页面数据
    getTableDataFn: function () {
      var params = {
        Cmd: "GetIPCameras"
      };
      AjaxFn('GET', '查询IPC数量', api.systemSetup.GetIPCameras, params, function (res) {
        logic.total = res.Content.Sum;
        var params = {
          Cmd: "GetIPCameraList",
          Content: {
            NumPerPage: logic.pageSize, // 每页的条目数
            PageIdx: logic.currPage // 第n页
          }
        };
        AjaxFn('GET', '查询IPC列表', api.systemSetup.GetIPCameraList, params, function (res) {
          logic.tableData = res.Content;

          logic.setTableFn(res.Content);

          //设置分页插件显示
          $("#page").whjPaging("setPage", {
            currPage: logic.currPage,
            totalPage: Math.ceil(logic.total / logic.pageSize),
            totalSize: logic.pageSize
          });

        });

      });
    },

    // 将获取的页面数据插入表格
    setTableFn: function (data) {
      if (!data) data = [];
      var html = '';
      $.each(data, function (i, v) {
        html += '<tr class="ipc-item" data-val="' + JSON.stringify(v).replace(/"/g, '`') + '">';
        html += '<td class="w-40"><i class="check-i not-check fa "></i></td>';
        html += '<td>' + v.Channel + '</td>';
        html += '<td>' + v.ChanName + '</td>';
        html += '<td>' + v.IP + '</td>';
        html += '<td>' + v.UserName + '</td>';
        html += '<td>' + v.PassWord + '</td>';
        html += '<td>' + v.Port + '</td>';
        // html += '<td>' + v.ProtocolType + '</td>';
        html += '<td>' + v.Manufacturer + '</td>';
        html += '<td>' + v.Longitude + '</td>';
        html += '<td>' + v.Latitude + '</td>';
        html += '<td>' + v.Altitude + '</td>';
        if (v.Status === '正常' || v.Status === '在线') {
          html += '<td class="w-50" style="color:green">' + v.Status + '</td>';
        } else if (v.Status === '异常' || v.Status === '不在线') {
          html += '<td class="w-50" style="color:red">' + v.Status + '</td>';
        } else {
          html += '<td class="w-50">' + v.Status + '</td>';
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
          btn: ['确定', '取消'] //按钮
        }, function () {
          var data = JSON.parse($($($this).parents('tr')[0]).attr('data-val').replace(/`/g, '"'))
          var ChannelArr = [
            { Channel: data.Channel }
          ];
          logic.deleteFn(ChannelArr);
        });
      });

      // 打开修改框
      $('.edit-item-a').click(function (eve) {
        eve.stopPropagation();

        $('.add-modal').attr('data-val', 'edit').find('.modal-title').text('修改');

        var data = $($(eve.target).parents('tr')[0]).attr('data-val');
        data = JSON.parse(data.replace(/`/g, '"'));
        // 插值
        $('.add-modal').attr('data-Channel', data.Channel);
        $('#from-aisleName').val(data.ChanName);
        $('#from-ip').val(data.IP);
        $('#from-userName').val(data.UserName);
        $('#from-password').val(data.PassWord);
        $('#from-port').val(data.Port);
        $('#from-manufacturers').val(data.Manufacturer);
        $('#from-longitude').val(data.Longitude);
        $('#from-latitude').val(data.Latitude);
        $('#from-height').val(data.Altitude);
        var s1 = $($('#protocol-type .option-item')[0]);
        $('#protocol-type .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));
        $('#protocol-type .option-item').each(function (i, v) {
          if ($(v).attr('data-val') == data.ProtocolType) {
            $('#protocol-type .select-result').text($(v).text())
              .attr('data-val', $(v).attr('data-val'));
          }
        });


        $('.add-modal').fadeIn();
      });

    },

    // table 滚动条 和 固定table头部
    setScroll: function () {
      $('.table-box thead th').each(function (i, v) {
        $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
      });

      var height = $('.main-chenge').height() - 54 - 62;
      $(".table-box").slimScroll({
        height: height,
        color: '#0394F9',
      });
    },

    // 全选 、 单个选择
    setCheckFn: function () {
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
    pageToolFn: function () {
      $("#page").whjPaging({
        pageSizeOpt: [{
          value: 10,
          text: '10条/页'
        }, {
          value: 20,
          text: '20条/页',
          selected: true
        }, {
          value: 30,
          text: '30条/页'
        }, {
          value: 40,
          text: '40条/页'
        }],
        isShowRefresh: false,
        isResetPage: true,
        confirm: "跳转",
        skip: "跳转到",
        callBack: function (currPage, pageSize) {
          logic.currPage = currPage;
          logic.pageSize = pageSize;

          logic.getTableDataFn();
        }
      });
    },

    // 删除请求函数
    deleteFn: function (ChannelArr) {
      var params = {
        Cmd: "DeleteIPCamera",
        Content: ChannelArr
      };
      AjaxFn('GET', '删除通道IPC', api.systemSetup.DeleteIPCamera, params, function (res) {
        logic.getTableDataFn(); // 重新获取列表
      });
    },

    // 添加请求函数
    addFn: function (dataArr) {
      var params = {
        Cmd: "AddIPCamera",
        Content: dataArr   // 添加最多支持五个
      };
      AjaxFn('POST', '添加通道IPC', api.systemSetup.AddIPCamera, params, function (res) {
        logic.getTableDataFn(); // 重新获取列表
        $('.modal-box').hide(); // 关闭模态框
      });
    },

    // 添加修改函数
    editFn: function (dataArr) {
      var params = {
        Cmd: "ModifyIPCamera",
        Content: dataArr
      };
      AjaxFn('POST', '修改通道IPC', api.systemSetup.ModifyIPCamera, params, function (res) {
        logic.getTableDataFn(); // 重新获取列表
        $('.modal-box').hide(); // 关闭模态框
      });
    }

  }
  logic.init();



});
