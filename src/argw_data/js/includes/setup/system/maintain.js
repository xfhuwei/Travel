$(function () {

  // 进入页面 第三级
  var tags3 = getUrlParam('tags3');
  !tags3 && (tags3 = 'upgrade');
  $('.maintain-nav>a').each(function (i, v) {
    if ($(v).attr('data-val').split('-')[2] === tags3) {
      $(v).addClass('active');
      $('.' + tags3 + '-main').show().siblings().remove();

      eval(tags3 + 'Fn' + '()');

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
      layer.confirm('您确定要重启系统吗？', {
        btn: ['确定', '取消']
      }, function () {
        var params = {
          Cmd: "ManualReboot"
        };
        AjaxFn('GET', '远程重启', api.systemSetup.ManualReboot, params, function (res) {
          // 做点什么？
        });
      });
    });

    // 选择文件
    $('#liulan-file').change(function (eve) {
      if (eve.target.files && eve.target.files.length >= 0) {
        $('#file-name').val(eve.target.files[0].name);
      }
    });

    // 点击升级
    $('#upgrade-btn').click(function () {
      // todo：不兼容ie
      var file = $('#liulan-file')[0].files[0];
      console.log(file);
      var formData = new FormData();
      formData.append('file', file);
      formData.append('Token', token);
      formData.append('size', file.size);
      //console.log(formData.get('file'));
      $('.modal-progress').show();
      $.ajax({
        url: api.systemSetup.Upgrade,
        type: 'POST',
        cache: false,
        data: formData,
        //dataType: 'json',
        //async: false,
        processData: false,
        contentType: false,
        xhr: function () { //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
          myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) { //检查upload属性是否存在
            //绑定progress事件的回调函数
            myXhr.upload.addEventListener('progress', function (e) {
              if (e.lengthComputable) {
                var percent = e.loaded / e.total * 100;
                $('.progress>span').css('width', percent.toFixed(2) + '%');
              }
            }, false);
          }
          return myXhr; //xhr对象返回给jQuery使用
        },
      }).done(function (res) {
        $('.modal-progress').hide();
      }).fail(function (res) {
        $('.modal-progress').hide();
      });
    });

    // 进度条测试
    // var i = 0;
    // var timer = setInterval(function () {
    //     i += 1;
    //     if (i > 100) {
    //         clearInterval(timer);
    //         timer = null;
    //         return;
    //     }
    //     $('.progress>span').css('width', i + '%');
    // }, 60);

    // 点击取消升级
    $('#quxiao').click(function () {
      layer.confirm('您确定要停止升级吗？', {
        btn: ['确定', '取消']
      }, function () {
        var params = {
          Cmd: "StopPostFile"
        };
        AjaxFn('GET', '停止发送升级包', api.systemSetup.StopPostFile, params, function (res) {
          // 做点什么？
        });
        $('.modal-progress').hide();
      });
    })

  }

  // 日志
  function logFn() {

    // 下拉选择框 fixme: 主类型改变的时候，次类型的选项要跟着改变
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

    // 时间日期选择器
    laydate.render({
      elem: '#start-date'
      , type: 'datetime'
      , theme: '#0d83f0'
      , btns: ['now', 'confirm']
    });
    laydate.render({
      elem: '#end-date'
      , type: 'datetime'
      , theme: '#0d83f0'
      , btns: ['now', 'confirm']
    });

    // 表格逻辑：取数据、分页...
    var logic = {
      tableData: '', // 存储表格数据
      total: 0, // 总条数
      pageSize: 20, // 分页中一页数据的条数
      currPage: 1, // 当前页
      mainType: '全部类型',
      subType: '全部类型',
      startTime: '',
      endTime: '',

      // 初始化
      init: function () {
        // 点击导出
        $('#derive-log').click(function () {
          var header = {
            Time: '时间',
            MainType: '主类型',
            SubType: '次类型',
            Channel: '通道号',
            User: '本地/远程用户',
            UserIP: '远程主机地址'
          }
          if (tableToExcel(header, logic.tableData, '日志列表')) {
            layer.msg('导出成功');
          } else {
            layer.msg('导出失败');
          }
        });

        // 查询
        $('#inquire-log').click(function () {
          var startDate = $('#start-date').val();
          var endDate = $('#end-date').val();
          if (!startDate || !endDate) {
            layer.msg('请先选择时间');
            return;
          }

          logic.mainType = $('#mainType').attr('data-val');
          logic.subType = $('#subType').attr('data-val');
          logic.startTime = startDate;
          logic.endTime = endDate;

          logic.currPage = 1; // 回归第一页
          logic.getTableDataFn();

        });

        logic.pageToolFn();

      },

      // 获取页面数据
      getTableDataFn: function () {
        var params = {
          Cmd: "ManualReboot",
          Content: {
            MainType: logic.mainType,
            SubType: logic.subType,
            StartTime: logic.startTime,
            EndTime: logic.endTime
          }
        };
        AjaxFn('GET', '查询日志数量', api.systemSetup.GetLogs, params, function (res) {
          logic.total = res.Content.Sum;

          var params = {
            Cmd: "ManualReboot",
            Content: {
              NumPerPage: logic.pageSize, // 每页的条目数
              PageIdx: logic.currPage // 第n页
            }
          };
          AjaxFn('GET', '查询日志列表', api.systemSetup.GetLogList, params, function (res) {
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
          html += '<tr>';
          html += '<td>' + (i+1) + '</td>';
          html += '<td>' + v.Time + '</td>';
          html += '<td>' + v.MainType + '</td>';
          html += '<td>' + v.SubType + '</td>';
          html += '<td>' + v.Channel + '</td>';
          html += '<td>' + v.User + '</td>';
          html += '<td>' + v.UserIP + '</td>';
          html += '</tr>';
        });
        $('.table-body').html(html);

        logic.setScroll();
        $(window).on("resize", logic.setScroll);

      },

      // table 滚动条 和 固定table头部
      setScroll: function () {
        $('.table-box thead th').each(function (i, v) {
          $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
        });

        var height = $('.main-chenge').height() - 35 - 70 - 49 - 52; // 表格高度
        $(".table-box").slimScroll({
          height: height,
          color: '#0394F9',
        });
      },

      // 创建分页条函数
      pageToolFn: function () {

        // 创建分页
        $("#page").whjPaging({
          // totalSize: logic.tableData.length, // 总条数
          // totalPage: pages.length, // 总页数
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
          skip: "跳转到"
          ,callBack: function (currPage, pageSize) {
            logic.currPage = currPage;
            logic.pageSize = pageSize;

            logic.getTableDataFn();
          }
        });

      }


    }
    logic.init();


  }

});
