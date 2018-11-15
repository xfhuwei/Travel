$(function () {

    // 下拉框选择 通用
    var selectDom = $('.select');
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

        layer.alert(
            '保存：<br/>' +
            pattern + '<br/>' +
            ipVersion + '<br/>' +
            subnetMask + '<br/>' +
            firstDNS + '<br/>' +
            mac + '<br/>' +
            ip + '<br/>' +
            gateway + '<br/>' +
            ReserveDNS
        );
    });

});
