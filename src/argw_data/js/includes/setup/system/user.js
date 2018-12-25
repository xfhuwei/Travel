$(function () {

  // 进入页面 第三级
  var tags3 = getUrlParam('tags3');
  !tags3 && (tags3 = 'manage');
  $('.user-nav>a').each(function (i, v) {
    if ($(v).attr('data-val').split('-')[2] === tags3) {
      $(v).addClass('active');
      $('.' + tags3 + '-main').show().siblings().remove();

      eval(tags3 + 'Fn' + '()');

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

    /* 多选框 */
    var powerOptions = {
      "0x01": "重复登录",
      "0x02": "用户管理之添加用户，隐含，不用呈现在界面上",
      "0x04": "用户管理之权限修改，隐含，不呈现在界面上",
      "0x08": "云台控制",
      "0x10": "升级",
      "0x20": "重启",
      "0x40": "IPC通道管理（增删改）"
    };
    var panelDom = $('.select-panel');
    // 溢出滚动条
    panelDom.find('.panel-list').slimScroll({
      height: panelDom.find('.panel-list').height(),
      color: '#0394F9'
    });
    // 全部分配
    panelDom.on('click', '.all-checked', function (eve) {
      $('.panel-yixuan').append($('.panel-kexuan').html());
      $('.panel-kexuan').html('');
    });
    // 全部删除
    panelDom.on('click', '.all-checkout', function (eve) {
      $('.panel-kexuan').append($('.panel-yixuan').html());
      $('.panel-yixuan').html('');
    });
    // 双击选择单选
    panelDom.on('dblclick', '.panel-item', function (eve) {
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
      init: function () {
        logic.getTableDataFn();

        // 关闭模态框
        $('.close-btn, .cancel').click(function () {
          $('.modal-box').hide();
        });

        // 打开新增框
        $('#add-btn').click(function (eve) {
          eve.stopPropagation();

          $('#add-name').val('');
          var s1 = $($('#add-typeSelect .option-item')[0]);
          $('#add-typeSelect .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));
          $('#add-apwd').val('');
          $('#add-pwd').val('');
          $('#add-cpwd').val('');
          $('#add-power .panel-yixuan').html('');
          $('#add-power .panel-kexuan').html('');
          $.each(powerOptions, function (i, v) {
            if (i !== '0x02' && i !== '0x04') {
              $('#add-power .panel-kexuan').append('<p class="panel-item" data-val="'+i+'">'+v+'</p>')
            }
          });

          $('.add-modal').fadeIn();
        });

        // 新增用户 确定
        $('#add-confbtn').click(function (eve) {
          var name = $('#add-name').val();
          var type = $('#add-utype').attr('data-val');
          var apwd = $('#add-apwd').val();
          var pwd = $('#add-pwd').val();
          var cpwd = $('#add-cpwd').val();
          var power = (0x02 | 0x04).toString(2);
          $('#add-power .panel-yixuan .panel-item').each(function (i, v) {
            var x = parseInt($(v).attr('data-val'), 16).toString(2);
            power = (parseInt(power, 2) | parseInt(x, 2)).toString(2);
          });
          power = parseInt(power, 2).toString(16);
          if (power < 10) {
            power = '0x0' + power;
          } else {
            power = '0x' + power;
          }
          if (pwd !== cpwd) {
            layer.msg('两次输入的密码不一致。');
            return;
          }
          var params = {
            Cmd: "AddUser",
            Content: {
              UserName: name,
              UserType: type,
              AdminPassword: apwd,
              Password: pwd,
              UserPower: power
            }
          };
          AjaxFn('POST', '增加用户', api.systemSetup.AddUser, params, function (res) {
            $('.modal-box').hide();
          });
        });

        // 修改密码 确定
        $('#edit-btn').click(function (eve) {
          var name = $('#edit-username').val();
          var opwd = $('#edit-oldpwd').val();
          var pwd = $('#edit-pwd').val();
          var cpwd = $('#edit-cpwd').val();
          if (pwd !== cpwd) {
            layer.msg('两次输入的密码不一致。');
            return;
          }
          var params = {
            Cmd: "ModifyUserPsw",
            Content: {
              UserName: name,
              Password: opwd,
              NewPassword: pwd
            }
          };
          AjaxFn('POST', '修改密码', api.systemSetup.ModifyUserPsw, params, function (res) {
            $('.modal-box').hide();
          });
        });

        // 修改权限 确定
        $('#power-btn').click(function (eve) {
          var name = $('#power-uname').val();
          var type = $('#power-utype').attr('data-val');
          var apwd = $('#power-apwd').val();
          var power = (0x02 | 0x04).toString(2);
          $('#power-power .panel-yixuan .panel-item').each(function (i, v) {
            var x = parseInt($(v).attr('data-val'), 16).toString(2);
            // console.log(power)
            // console.log(x)
            power = (parseInt(power, 2) | parseInt(x, 2)).toString(2);
          });
          power = parseInt(power, 2).toString(16);
          if (power < 10) {
            power = '0x0' + power;
          } else {
            power = '0x' + power;
          }
          // console.log(power)
          var params = {
            Cmd: "ModifyUserPower",
            Content: {
              UserName: name,
              UserType: type,
              AdminPassword: apwd,
              UserPower: power
            }
          };
          AjaxFn('POST', '修改权限', api.systemSetup.ModifyUserPower, params, function (res) {
            $('.modal-box').hide();
          });
        });

      },

      // 获取页面数据
      getTableDataFn: function () {
        var params = {
          Cmd: "GetUserList"
        };
        AjaxFn('GET', '获取用户列表', api.systemSetup.GetUserList, params, function (res) {
          logic.setTableFn(res.Content);
        });
      },

      // 将获取的页面数据插入表格
      setTableFn: function (data) {
        if (!data) data = [];
        var html = '';
        $.each(data, function (i, v) {
          html += '<tr class="ipc-item">';
          // html += '<td class="w-40"><i class="check-i not-check fa "></i></td>';
          html += '<td>' + v.UserName + '</td>';
          html += '<td>' + v.UserType + '</td>';
          html += '<td class="lastTd">';
          if (v.UserName !== 'admin') { // 管理员不可删除和修改权限
            html += '<a title="删除" class="remove-item-a" data-val="' + v.UserName + '"></a>';
            html += '<a title="修改权限" class="limits-item-a" data-power="' + v.UserPower + '" data-type="' + v.UserType + '" data-val="' + v.UserName + '"></a>';
          }
          html += '<a title="修改密码" class="password-item-a" data-val="' + v.UserName + '"></a>';
          html += '</td></tr>';
        });
        $('.table-body').html(html);

        // $(".check-th>i").removeClass('fa-check-square-o').addClass('not-check');

        logic.setScroll();
        $(window).on("resize", logic.setScroll);

        // 点击删除一行
        $('.remove-item-a').click(function () {
          var $this = $(this);
          var name = $this.attr('data-val');
          if (name === 'admin') {
            layer.msg('管理员不可被删除。');
            return;
          }
          //询问框
          var html = '<label>请输入管理员密码：</label><input class="from-input" id="delAdminPwd">';
          layer.confirm(html, {
            title: '删除用户',
            btn: ['确定', '取消'] //按钮
          }, function () {
            var pwd = $('#delAdminPwd').val();
            var params = {
              Cmd: "DeleteUser",
              Content: {
                UserName: name,
                AdminPassword: pwd
              }
            };
            AjaxFn('GET', '删除用户', api.systemSetup.DeleteUser, params, function (res) {
              logic.getTableDataFn(); // 重新获取列表
            });
          });
        });

        // 打开修改权限框
        $('.limits-item-a').click(function (eve) {
          eve.stopPropagation();
          $('#power-uname').val($(this).attr('data-val'));

          var s1 = $($('#userType-select .option-item')[0]);
          var utype = $(this).attr('data-type');
          $('#userType-select .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));
          $('#userType-select .option-item').each(function (i, v) {
            if ($(v).attr('data-val') == utype) {
              $('#userType-select .select-result').text($(v).text())
                .attr('data-val', $(v).attr('data-val'));
            }
          });

          // 权限解析赋值
          var upower = $(this).attr('data-power');
          var arr = [];
          upower = parseInt(upower.replace('0x', ''), 16).toString(2).split('').reverse();
          // console.log(upower)
          $.each(upower, function (i, v) {
            if (v === '1') {
              var a = [1];
              for (var j = 0; j < i; j++) {
                a.push(0);
              }
              var x = parseInt(a.join(''), 2).toString(16);
              if (x < 10) {
                arr.push('0x0' + x);
              } else {
                arr.push('0x' + x);
              }
            }
          });
          $('#power-power .panel-yixuan').html('');
          $('#power-power .panel-kexuan').html('');
          $.each(powerOptions, function (i, v) {
            var pd = false;
            $.each(arr, function (ii, vv) {
              if (i === vv) {
                pd = true;
              }
            });
            if (pd) {
              if (i !== '0x02' && i !== '0x04') {
                $('#power-power .panel-yixuan').append('<p class="panel-item" data-val="'+i+'">'+v+'</p>')
              }
            } else {
              $('#power-power .panel-kexuan').append('<p class="panel-item" data-val="'+i+'">'+v+'</p>')
            }
          });
          // console.log(arr);

          $('.limits-modal').fadeIn();
        });

        // 打开修改密码框
        $('.password-item-a').click(function (eve) {
          eve.stopPropagation();
          $('#edit-username').val($(this).attr('data-val'));
          $('.password-modal').fadeIn();

          var $this = $(this);
          var name = $this.attr('data-val');

        });

      },

      // table 滚动条 和 固定table头部
      setScroll: function () {
        $('.table-box thead th').each(function (i, v) {
          $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
        });

        var height = $('.main-chenge').height() - 35 - 70 - 62;
        $(".table-box").slimScroll({
          height: height,
          color: '#0394F9',
        });
      }

    }
    logic.init();

  }

  // 在线用户
  function onlineFn() {

    // table 滚动条 和 固定table头部
    function setScroll() {
      $('.table-box thead th').each(function (i, v) {
        $($('.scroll-header thead th')[i]).css('width', $(v).width() + 1);
      });

      var height = $('.main-chenge').height() - 35 - 70; // 表格高度
      $(".table-box").slimScroll({
        height: height,
        color: '#0394F9'
      });
    }

    // 获取在线用户数据
    var params = {
      Cmd: "GetOnlineUser"
    };
    AjaxFn('GET', '获取在线用户数据', api.systemSetup.GetOnlineUser, params, function (res) {
      var html = '';
      var data = res.Content ? res.Content : [];
      $.each(data, function (i, v) {
        html += '<tr>';
        html += '<td>' + (i + 1) + '</td>';
        html += '<td>' + v.UserName + '</td>';
        html += '<td>' + v.UserType + '</td>';
        html += '<td>' + v.UserIP + '</td>';
        html += '<td>' + v.LoginTime + '</td>';
        html += '</tr>';
      });
      $('.table-body').html(html);

      setScroll()
      $(window).on("resize", setScroll);
    });

  }

});
