// 海关舱单 js
var customsManifest = new Vue({
  el: '#customsManifest',
  data: {
    isShowBox: false
  },
  methods: {
    openModelBox: function () {
      this.isShowBox = true
    }
  }
});
