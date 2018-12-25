$(function () {

    // 选择播放性能
    $('#play-performance>span').click(function () {
        $(this).addClass('active').siblings('.active').removeClass('active');

    });

    // 选择文件目录 fixme: 仅ie可用且有权限问题
    $('#view-folder, #pic-folder').click(function () {
        try {
            var Message = "\u8bf7\u9009\u62e9\u6587\u4ef6\u5939"; //选择框提示信息
            var Shell = new ActiveXObject("Shell.Application");
            var Folder = Shell.BrowseForFolder(0, Message, 64, 17); //起始目录为：我的电脑
            //var Folder = Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面
            if (Folder != null) {
                Folder = Folder.items(); // 返回 FolderItems 对象
                Folder = Folder.item(); // 返回 Folderitem 对象
                Folder = Folder.Path; // 返回路径
                if (Folder.charAt(Folder.length - 1) != "\\") {
                    Folder = Folder + "\\";
                }
                $(this).prev().val(Folder);
                return Folder;
            }
        }
        catch (e) {
            if (e.message === '没有权限') {
                layer.alert('没有读取本地目录的权限，请在：<br/> 1、Internet选项 -> 安全 -> 受信任的站点 -> 站点 -> 添加（此站点） <br/> 2、 Internet选项 -> 安全 -> 受信任的站点 -> 自定义级别 -> ActiveX控件和插件 -> <br/> 对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本 -> 启用')
            } else {
                if (e.message === 'ActiveXObject is not defined') {
                    e.message = '仅在IE浏览器下才可选择文件夹';
                }
                layer.msg(e.message);
            }

        }
    });


    // 保存
    $('#local-save').click(function () {
        var playParam = $('#play-performance>span.active').attr('data-val');
        var viewPath = $('input[name="viewPath"]').val();
        var picPath = $('input[name="picPath"]').val();
        layer.msg('保存：' + playParam + '，' + viewPath + '，' + picPath);
    });


});