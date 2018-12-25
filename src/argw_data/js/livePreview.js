// 点流插件函数调用
function GetOcxValue() { // 初始化并登入服务器
  // console.log(test6yr.nSysLogNum);
  $("#GxxWebClient")[0].OCX_Server_init("192.168.39.70",6666,"admin","admin");
}
function settings(ip, port, id, channel, streamtype) { // 登录设备并进行播放实时流
  // console.log(test6yr.nSysLogNum);
  ip || (ip = "172.16.26.157");
  port || (port = 36666);
  id || (id = 1);
  channel || (channel = 1);
  streamtype || (streamtype = 1);
  // 设备ip、设备端口号、设备id、设备频道、设备码流
  $("#GxxWebClient")[0].OCX_Dev_LoginAndPlayVideo(ip, port, id, channel, streamtype);
}
function OCXInit() {
  console.log("The OCXInit return is:"+$("#GxxWebClient")[0].OCX_Init()+"\n");
}
function OCXUninit() {
  console.log("The OCXUninit return is:"+ $("#GxxWebClient")[0].OCX_Uninit()+"\n");
}
function OCXClose() { // 关闭视频流
  console.log("The OCXUninit return is:"+ $("#GxxWebClient")[0].OCX_CloseVideo()+"\n");
}

$(function () {
  _lp.init();

  // 下载控件相关
  window.onload = window.onresize = function () {
    // if (document.all.GxxWebClient.object == null ) {
    //   // var gDevOcxVersion = 'v1.0.0'
    //   document.getElementById('div_Downloadocx').style.display = "block";
    //   // document.getElementById('a_ocx').href = "VideoWebOcx_" + gDevOcxVersion + ".msi";
    //   document.getElementById('a_ocx').href = "./plug/MFmA.msi";
    // }
    var test6yr = $("#GxxWebClient")[0];
    console.log(test6yr.nSysLogNum)
    if (test6yr.nSysLogNum) {
      test6yr.style.display = "block";
      document.getElementById('div_Downloadocx').style.display = "none";

      GetOcxValue()
      settings()

    } else {
      test6yr.style.display = "none";
      document.getElementById('div_Downloadocx').style.display = "block";
      document.getElementById('a_ocx').href = "./plug/MFmA1.0.1.msi";
    }
  }


});
// livePreiew 页面逻辑
var _lp = {
  StreamType: 0 // 0 主码流；1次码流；3第三码流
  , Channel: 0 // 当前播放的视频通道
  , bOpen: 1 // 1开流，0关流

  , PresetID: null // 预位置id
  , CruiseID: null // 巡航 id

  // 初始化
  , init: function () {
    // 设置一屏高度
    function sizeFn() {
      $('.live-preview-container').height($('body').height() - 50);
      $('.video-box').css('width', $('body').width() - 300 + 'px');
      $('.nav-top .list').css('height', $('.nav-top').height() - 35 + 'px');
      $('#player').css('height', $('.video-main').height());

      // 溢出滚动条
      $(".nav-top .list").slimScroll({
        height: $('.nav-top .list').height(),
        color: '#0394F9',
      });
      $(".xunhang .table_body").slimScroll({
        height: $('.xunhang .table_body').height(),
        color: '#0394F9',
      });
      $(".yuweizi .table_body").slimScroll({
        height: $('.yuweizi .table_body').height(),
        color: '#0394F9',
      });
    }

    sizeFn();
    $(window).on("resize", sizeFn);

    // 切换码流
    $('#maliu>.maliu-hide>span').click(function () {
      $(this).addClass('active').siblings('.active').removeClass('active');
      $('#maliu')[0].className = 'maliu ' + $(this)[0].className.split(' ')[0].split('-')[0];

      _lp.StreamType = $(this).attr('data-val');
      _lp.changeVideoFn(_lp.Channel, _lp.StreamType, _lp.bOpen);


    });

    // 操作台切换
    $('#operating-floor>a').click(function () {
      var $this = $(this)
      $this.addClass('active').siblings('.active').removeClass('active');
      $this.parent().siblings('div').hide().each(function (i, v) {
        if (v.className.split(' ')[0] === $this.attr('data-val')) {
          $(v).show();
        }
      });
    });

    // 收起操作台
    $('#flex-floor').click(function () {
      if ($(this).hasClass('fa-sort-down')) {
        $(this).addClass('fa-sort-up').removeClass('fa-sort-down')
          .attr('title', '展开操作台').css({'top': 'auto', 'bottom': 0});
        $('.nav-bottom').stop().animate({'height': '32px'});
        $('.nav-top').stop().animate({'padding-bottom': '32px'}, function () {
          sizeFn();
        });
      } else {
        $(this).addClass('fa-sort-down').removeClass('fa-sort-up')
          .attr('title', '收起操作台').css({'bottom': 'auto', 'top': 0});
        $('.nav-bottom').stop().animate({'height': '242px'});
        $('.nav-top').stop().animate({'padding-bottom': '242px'}, function () {
          sizeFn();
        });
      }
      // padding-bottom 242px;

    });

    // 云台 range控件
    var rangeValue = $('.range-slider').val();
    $('.range-slider').jRange({
      from: 0,
      to: 100,
      step: 1,
      theme: 'theme-green',
      format: '%s',
      width: 150,
      showLabels: true,
      showScale: false,
      isRange: false
    });
    $('.range-minus').click(function () {
      var rangeValue = $('.range-slider').val() * 1;
      rangeValue--;
      if (rangeValue <= 0) {
        rangeValue = 0
      }
      $('.range-slider').jRange('setValue', rangeValue.toString());
    });
    $('.range-plus').click(function () {
      var rangeValue = $('.range-slider').val() * 1;
      rangeValue++;
      if (rangeValue >= 100) {
        rangeValue = 100
      }
      $('.range-slider').jRange('setValue', rangeValue.toString());
    });


    // 云台各按钮操作
    $('#yt-btns>li>a').click(function () {
      var action = $(this).attr('data-val');
      var speed = $('.range-slider').val();
      _lp.ptzCtrl(_lp.Channel, action, speed);
    });

    _lp.getIPClist();

    _lp.presetEvent();
    _lp.cruiseEvent();

  }

  // 获取页面数据
  , getIPClist: function () {
    var params = {
      Cmd: "GetIPCameras"
    };
    AjaxFn('GET', '查询IPC数量', api.systemSetup.GetIPCameras, params, function (res) {
      if (!res.Content.Sum) {
        return;
      }
      var params = {
        Cmd: "GetIPCameraList",
        Content: {
          NumPerPage: res.Content.Sum, // 每页的条目数
          PageIdx: 1 // 第n页
        }
      };
      console.log(params)
      AjaxFn('GET', '查询IPC列表', api.systemSetup.GetIPCameraList, params, function (res) {

        _lp.setIPCList(res.Content);

      });

    });
  }

  // 渲染ipc列表
  , setIPCList: function (data) {
    var html = '';
    $.each(data, function (i, v) {
      html += '<a data-ip="'+ v.Port +'" data-ip="'+ v.IP +'" data-val="'+ v.Channel +'"><i></i>' + v.ChanName + '</a>';
    });
    $('#gallery-list').html(html);

    // 选择视频通道 （点流）
    $('#gallery-list>a').click(function () {
      $(this).addClass('active').siblings('.active').removeClass('active');
      _lp.Channel = $(this).attr('data-val');
      _lp.changeVideoFn(_lp.Channel, _lp.StreamType, _lp.bOpen);

      // 设备ip、设备端口号、设备id、设备频道、设备码流
      var ip = $(this).attr('data-ip');
      var port = $(this).attr('data-port');
      settings(ip, port, _lp.Channel, 0, _lp.StreamType);

    });

  }

  // 切换视频通道函数
  , changeVideoFn: function (Channel, StreamType, bOpen) {
    // 请求点流
    var params = {
      Cmd: "VideoPlay",
      Content: {
        Channel: Channel ? Channel : 0,
        StreamType: StreamType ? StreamType : 0, // 0 主码流；1次码流；3第三码流
        bOpen: bOpen ? bOpen : 1 // 1开流，0关流
      }
    };
    AjaxFn('GET', '点流', api.livePreview.VideoPlay, params, function (res) {
      // todo：成功如何显示视频
      layer.msg('todo：成功后如何显示视频？');
    });
  }

  /**
   * 云台操作请求
   * @param channel
   * @param action:
   * Up 上, Left 左, Right 右, LeftUp 左上, RightUp 右上, LeftDown 左下, RightDown 右下, Down 右下,
   * ZoomTele 变倍小, ZoomWide 变倍大, FocusNear 聚焦近, FocusFar 聚焦远, IrisOpen 光圈开, IrisClose 光圈关,
   * Stop 云台停止
   * @param speed
   */
  , ptzCtrl: function (channel, action, speed) {
    // 请求云台控制
    var params = {
      Cmd: "PtzCtrl",
      Content: {
        Channel: channel ? channel : 0,
        Action: action ? action : "Down",
        ParamH: speed ? speed : 0, // 水平速度级别
        ParamV: speed ? speed : 0 // 垂直速度级别
      }
    };
    AjaxFn('GET', '云台控制', api.livePreview.PtzCtrl, params, function (res) {
      // 成功应该需不需要做些什么呢？
    });
  }

  // 预置点操作函数
  , presetFn: function (channel, action, PresetID) {
    var params = {
      Cmd: "Preset",
      Content: {
        Channel: channel ? channel : 0,
        Action: action ? action : "set", // set、goto、delete
        PresetID: PresetID ? PresetID : null,
      }
    };
    AjaxFn('GET', '预置点操作', api.livePreview.Preset, params, function (res) {
      // todo：预置点操作成功应该需不需要做些什么呢 如更新一下列表？
    });
  }
  // 预置点操作事件
  , presetEvent: function () {
    _lp.PresetID = $('#ywz-list .active').attr('data-val'); // 初始化插入id
    // 点击预置点列表
    $('#ywz-list>li').click(function () {
      $(this).addClass('active').siblings('.active').removeClass('active');
      _lp.PresetID = $(this).attr('data-val');
    });
    // 添加设置预置点
    $('#add-ywz').click(function () {
      _lp.presetFn(_lp.Channel, 'set', null);
    });
    // 删除预置点
    $('#del-ywz').click(function () {
      _lp.presetFn(_lp.Channel, 'delete', _lp.PresetID);
    });
    // 预览预置点
    $('#view-ywz').click(function () {
      _lp.presetFn(_lp.Channel, 'goto', _lp.PresetID);
    });
    // 上移预置点
    $('#view-ywz').click(function () {
      // TODO 上移预设点
    });
    // 下移预置点
    $('#view-ywz').click(function () {
      // TODO 下移预设点
    });
  }

  // 巡航操作函数
  , cruiseFn: function (channel, action, CruiseID, CruisePreset) {
    // CruisePreset: [
    //     {
    //         PresetID: 1, // 预置点编号
    //         Interval: 5 // 1-255秒
    //     },
    //     {
    //         PresetID: 2,
    //         Interval: 5
    //     }
    // ]
    var params = {
      Cmd: "Cruise",
      Content: {
        Channel: channel ? channel : 0,
        Action: action ? action : "set", // set、goto、delete
        CruiseID: CruiseID, // 巡航编号
        CruisePreset: CruisePreset
      }
    };
    AjaxFn('GET', '巡航操作', api.livePreview.Preset, params, function (res) {
      // todo：巡航操作成功应该需不需要做些什么呢 如更新一下列表？
    });
  }
  // 巡航操作事件
  , cruiseEvent: function () {
    // todo：需求不明
    _lp.CruiseID = $('#ywz-list .active').attr('data-val'); // 初始化插入id
    // 点击预置点列表
    $('#xh-list>li').click(function () {
      $(this).addClass('active').siblings('.active').removeClass('active');
      _lp.CruiseID = $(this).attr('data-val');
    });
    // 添加设置巡航
    $('#add-xh').click(function () {
      var CruisePreset = [
        {
          PresetID: 1, // 预置点编号
          Interval: 5 // 1-255秒
        },
        {
          PresetID: 2,
          Interval: 5
        }
      ]
      _lp.cruiseFn(_lp.Channel, 'set', null, CruisePreset);
    });
    // 修改巡航
    $('#edit-ywz').click(function () {

    });
    // 删除巡航
    $('#del-ywz').click(function () {
      _lp.cruiseFn(_lp.Channel, 'delete', _lp.CruiseID, null);
    });
    // 播放巡航
    $('#play-xh').click(function () {
      _lp.cruiseFn(_lp.Channel, 'goto', _lp.CruiseID, null);
    });
    // 停止巡航
    $('#stop-xh').click(function () {

    });
  }


  // todo：3d定位
  // 点击 或 框选 网页播放框时的定位？
  // 3d定位请求函数
  , position3d: function (channel, x1, y1, x2, y2) {
    var params = {
      Cmd: "Preset",
      Content: {
        Channel: channel ? channel : 0,
        x1: x1,
        y1: y1,
        x2: x2 ? x2 : x1,
        y2: y2 ? y2 : y1
      }
    };
    AjaxFn('GET', '3d定位', api.livePreview.Position3D, params, function (res) {
      // 做点什么？
    });
  }

};
