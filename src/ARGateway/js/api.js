/**
 *  接口名
 * */
var host = window.location.host + "/ARGateway";
var api = {
    login: {
        Login: './data/login/login.json'  // 客户端登录设备
        ,Logout: './data/login/logout.json' // 客户端请求注销
    },
    livePreview: {
        VideoPlay: './data/livePreview/VideoPlay.json' // 客户端请求点流
        ,PtzCtrl: './data/livePreview/PtzCtrl.json' // 云台控制
        ,Preset: './data/livePreview/Preset.json' // 预设点
        ,Cruise: './data/livePreview/Cruise.json' // 巡航
        ,Position3D: './data/livePreview/Position3D.json' // 3D 定位
    },
    systemSetup: {
        GetBasicInfo: './data/systemSetup/system/setup/GetBasicInfo.json' // 请求设备基本信息
        ,SetBasicInfo: './data/systemSetup/system/setup/SetBasicInfo.json' // 设置设备基本信息

        ,GetTimeCfg: './data/systemSetup/system/setup/GetTimeCfg.json' // 获取时间配置
        ,SetTimeCfg: './data/systemSetup/system/setup/SetTimeCfg.json' // 设置时间配置

        ,GetLogs: '' // 查询日志总数
        ,GetLogList: '' // 获取日志列表

        ,GetIPCameras: '' // 查询通道IPC数量
        ,GetIPCameraList: '' // 获取通道IPC列表
        ,AddIPCamera: '' // 添加通道IPC
        ,DeleteIPCamera: '' // 删除通道IPC
        ,ModifyIPCamera: '' // 修改通道IPC
        ,IPCStatusPost: '' // 通道IPC状态上送

        ,GetUserList: '' // 获取用户列表
        ,ModifyUserPsw: '' // 修改用户密码
        ,ModifyUserPower: '' // 修改用户权限
        ,DeleteUser: '' // 删除用户
        ,GetOnlineUser: '' // 获取在线用户

        ,GetNetworkCfg: '' // 获取网络参数
        ,SetNetworkCfg: '' // 设置网络参数

        ,GetAuthorizationInfo: '' // 获取授权信息
        ,UpdateAuthorization: '' // 更新授权
        ,Upgrade: '' // 请求升级
        ,StopPostFile: '' // 停止发送升级包
        ,UpgradeProgressPost: '' // 升级进度上送
        ,UpgradeStatusPost: '' // 升级状态上送

        ,ManualReboot: '' // 客户端请求手动重启设备






    }
}