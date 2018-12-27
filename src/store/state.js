let defaultCity = '广州'
try { // 防止用户关闭了浏览器本地存储功能或进入隐身模式浏览页面
  if (localStorage.city) {
    defaultCity = localStorage.city
  }
} catch (e) {}

export default {
  city: defaultCity
}
