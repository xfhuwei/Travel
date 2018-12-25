/**
 *  接口名
 * */
var host = window.location.host;
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

        ,GetLogs: './data/systemSetup/system/maintain/GetLogs.json' // 查询日志总数
        ,GetLogList: './data/systemSetup/system/maintain/GetLogList.json' // 获取日志列表

        ,GetIPCameras: './data/systemSetup/system/aisle/GetIPCameras.json' // 查询通道IPC数量
        ,GetIPCameraList: './data/systemSetup/system/aisle/GetIPCameraList.json' // 获取通道IPC列表
        ,AddIPCamera: './data/systemSetup/system/aisle/AddIPCamera.json' // 添加通道IPC
        ,DeleteIPCamera: './data/systemSetup/system/aisle/DeleteIPCamera.json' // 删除通道IPC
        ,ModifyIPCamera: './data/systemSetup/system/aisle/ModifyIPCamera.json' // 修改通道IPC
        ,IPCStatusPost: './data/systemSetup/system/aisle/ModifyIPCamera.json' // 通道IPC状态上送 ???如何用

        ,GetUserList: './data/systemSetup/system/user/GetUserList.json' // 获取用户列表
        ,ModifyUserPsw: './data/systemSetup/system/user/ModifyUserPsw.json' // 修改用户密码
        ,ModifyUserPower: './data/systemSetup/system/user/ModifyUserPower.json' // 修改用户权限
        ,DeleteUser: './data/systemSetup/system/user/DeleteUser.json' // 删除用户
        ,GetOnlineUser: './data/systemSetup/system/user/GetOnlineUser.json' // 获取在线用户
        ,AddUser: './data/systemSetup/system/user/AddUser.json' // 新增在线用户

        ,GetNetworkCfg: './data/systemSetup/net/GetNetworkCfg.json' // 获取网络参数
        ,SetNetworkCfg: './data/systemSetup/net/SetNetworkCfg.json' // 设置网络参数

        ,GetAuthorizationInfo: './data/systemSetup/net/GetAuthorizationInfo.json' // 获取授权信息
        ,UpdateAuthorization: './data/systemSetup/net/UpdateAuthorization.json' // 更新授权

        ,Upgrade: './data/systemSetup/system/maintain/Upgrade.json' // 请求升级
        ,StopPostFile: './data/systemSetup/system/maintain/StopPostFile.json' // 停止发送升级包
        ,UpgradeProgressPost: './data/systemSetup/system/maintain/UpgradeProgressPost.json' // 升级进度上送
        ,UpgradeStatusPost: './data/systemSetup/system/maintain/UpgradeStatusPost.json' // 升级状态上送

        ,ManualReboot: './data/systemSetup/system/maintain/ManualReboot.json' // 客户端请求手动重启设备






    }
}
