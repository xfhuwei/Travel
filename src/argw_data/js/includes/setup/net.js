$(function () {

  // 下拉框选择 通用
  var selectDom = $('.select');
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

  // 请求获取基本信息
  var params = {
    Cmd: "GetNetworkCfg"
  };
  AjaxFn('GET', '获取网络参数', api.systemSetup.GetNetworkCfg, params, function (res) {
    var data = res.Content;

    var s1 = $($('#pattern-select .option-item')[0]);
    $('#pattern-select .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));
    $('#pattern-select .option-item').each(function (i, v) {
      if ($(v).attr('data-val') == data.Mode) {
        $('#pattern-select .select-result').text($(v).text())
          .attr('data-val', $(v).attr('data-val'));
      }
    });
    var s1 = $($('#ipVersion-select .option-item')[0]);
    $('#ipVersion-select .select-result').text(s1.text()).attr('data-val', s1.attr('data-val'));
    $('#ipVersion-select .option-item').each(function (i, v) {
      if ($(v).attr('data-val') == data.IPVersion) {
        $('#ipVersion-select .select-result').text($(v).text())
          .attr('data-val', $(v).attr('data-val'));
      }
    });
    $('#from-subnetMask').val(data.SubnetMask);
    $('#from-firstDNS').val(data.FirstDNS);
    $('#from-mac').val(data.MAC);
    $('#from-ip').val(data.IP);
    $('#from-gateway').val(data.DefaultGateway);
    $('#from-ReserveDNS').val(data.SecondDNS);
  });

  // 保存
  $('#net-save').click(function () {
    var pattern = $('#from-pattern').attr('data-val');
    var ipVersion = $('#from-ipVersion').attr('data-val');
    var subnetMask = $('#from-subnetMask').val();
    var firstDNS = $('#from-firstDNS').val();
    var mac = $('#from-mac').val();
    var ip = $('#from-ip').val();
    var gateway = $('#from-gateway').val();
    var ReserveDNS = $('#from-ReserveDNS').val();

    // dns可以为空

    var params = {
      Cmd: "SetNetworkCfg",
      Content: {
        Mode: pattern,
        IP: ip,
        SubnetMask: subnetMask,
        DefaultGateway: gateway,
        FirstDNS: firstDNS,
        SecondDNS: ReserveDNS,
        IPVersion: ipVersion
      }
    };
    AjaxFn('POST', '设置网络参数', api.systemSetup.SetNetworkCfg, params, function (res) {
      // 做点什么？
    });

  });

});
