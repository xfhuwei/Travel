export default {
  changeCity (state, city) {
    state.city = city
    try { // 防止用户关闭了浏览器本地存储功能或进入隐身模式浏览页面
      localStorage.city = city
    } catch (e) {}
  }
}
