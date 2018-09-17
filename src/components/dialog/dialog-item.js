/**
 * 原生js简易弹出层
 * author: laohu
 */
window.dialog = {
  init: function() {

    // 加载css
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    var scripts = document.getElementsByTagName('script');
    var file;
    for (var i = 0; i < scripts.length; i ++) {
      var url = scripts[i].getAttribute('src');
      if (url.indexOf('dialog-item.js')) {
        file = url.replace('.js', '.css');
      }
    }
    css.href = file;
    document.head.appendChild(css);



    console.log('laohu简易原生js弹出提示层已生效。');

  },

  /**
   *  提示弹出框 msg
   *
   */
  msg: function(content, time, callback) {

    if (!content) { content = '这是一条提示。'; }
    if (!time) { time = 3000; }
    if (!callback) { callback = function(){}; }

    var div = document.createElement("div");
    div.className = 'dialog-box dialog-msg-box';
    div.innerHTML = `
      <div class="dialog-msg animated">${ content }</div>
    `;
    document.body.appendChild(div);
    div.children[0].className += ' bounceIn';

    setTimeout(function () {
      div.children[0].className += ' bounceOut';
      setTimeout(function(){
        div.parentNode.removeChild(div);
        callback();
      }, 750);
    }, time);

  },

  /**
   *  消息弹出框 alert
   *
   */
  alert: function (content, callback) {

    if (!content) { content = '这是一条提示。'; }
    if (!callback) { callback = function(){}; }

    var div = document.createElement("div");
    div.className = 'dialog-box dialog-alert-box';
    div.innerHTML = `
      <div class="dialog-alert animated">
        <div class="alert-title">提示</div>
        <div class="alert-content">${content}</div>
        <div class="alert-footer">
          <button>确定</button>
        </div>
      </div>
    `;
    document.body.appendChild(div);

    div.children[0].className += ' bounceIn';

    var button = div.children[0].children[2].children[0];
    button.onclick = function () {
      div.children[0].className += ' bounceOut';
      setTimeout(function(){
        div.parentNode.removeChild(div);
        callback();
      }, 750);
    }
  },

  /**
   *  确认框 affirm
   *
   */
  affirm: function (content, Tcallback, Qcallback) {

    if (!content) { content = '这是一条提示。'; }
    if (!Tcallback) { Tcallback = function(){}; }
    if (!Qcallback) { Qcallback = function(){}; }

    var div = document.createElement("div");
    div.className = 'dialog-box dialog-affirm-box';
    div.innerHTML = `
      <div class="dialog-alert animated">
        <div class="alert-title">提示</div>
        <div class="alert-content">${content}</div>
        <div class="alert-footer">
          <button>确定</button>
          <button>取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(div);

    div.children[0].className += ' bounceIn';

    var button = div.children[0].children[2].children;
    button[0].onclick = function () {
      div.children[0].className += ' bounceOut';
      setTimeout(function(){
        div.parentNode.removeChild(div);
        Tcallback();
      }, 750);
    }
    button[1].onclick = function () {
      div.children[0].className += ' bounceOut';
      setTimeout(function(){
        div.parentNode.removeChild(div);
        Qcallback();
      }, 750);
    }

  },

  /**
   *  遮罩层 load
   *
   */
  load: function (style, time) {

    var div = document.createElement("div");
    div.className = 'dialog-box dialog-load-box';

    if (style == 1) {
      div.innerHTML = `
        <div class="animated">
          <div class="dialog-load-1 animated">
            <div class="load-content">加载中...</div>
          </div>
        </div>
      `;
    } else {
      div.innerHTML = `
        <div class="animated">
          <div class="dialog-load-0 animated"></div>
        </div>
      `;
    }

    document.body.appendChild(div);
    div.children[0].className += ' bounceIn';

    if (time) {
      setTimeout(function () {
        div.children[0].className += ' bounceOut';
        setTimeout(function(){
          div.parentNode.removeChild(div);
        }, 750);
      }, time);
    }

  },

   /**
   *  关闭
   *  不填则全部关闭
   *  用此方法关闭框则写好的回调不会再执行
   */
  close: function (name, callback) {
    if (!callback) { callback = function(){}; }
    if (name) {
      name = '.dialog-'+ name +'-box';
    } else {
      name = '.dialog-box';
    }
    var eles = document.querySelectorAll(name);
    for (var i=0; i<eles.length; i++) {
      var ele = eles[i];
      ele.children[0].className += ' bounceOut';
      setTimeout(function(){
        ele.parentNode.removeChild(ele);
        callback();
      }, 750);
    }
  },

  /**
   *  更改主题颜色
   *  为了省事只能传 rgb 的色值 ， 如 '8, 107, 201'
   */
  style: function (rgb) {
    if (!rgb) {
      return;
    }
    var style = document.getElementById('dialog-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'dialog-style';
    }
    style.innerHTML = `
      .dialog-box {
        --color: rgba(${rgb}, 0.9);
        --sColor: rgba(${rgb}, 1);
        --qColor: rgba(${rgb}, 0.8);
        --c2: rgba(${rgb}, 0.2);
        --c5: rgba(${rgb}, 0.5);
        --c7: rgba(${rgb}, 0.7);
      }
    `
    document.head.appendChild(style);
  }


}

// 启动
window.dialog.init();
