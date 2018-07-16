// 海关舱单 js

// 获取url中指定名称的参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}
// 删除 当前年 的 前一年及其以前的数据
function del2017Date(arr, name) {
  if (arr.length <= 0) return;
  var string = (new Date().getFullYear() - 1) + '-12-30 23:59:59';
  var date2017after = new Date(string);
  var dateThis;
  _.forEach(arr, function (value, index) {
    dateThis = new Date(value[name]);
    if (dateThis - date2017after <= 0) {
      arr[index].isShow = false;
    } else {
      arr[index].isShow = true;
    }
  });
  return arr;
}
function del2017DateObj(obj, name) {
  var string = (new Date().getFullYear() - 1) + '-12-30 23:59:59';
  var date2017after = new Date(string);
  var dateThis = new Date(obj[name]);
  if (dateThis - date2017after <= 0) {
    obj.isShow = false;
  } else {
    obj.isShow = true;
  }
  return obj;
}


var bizOperation = new Vue({
  el: '#bizOperation',
  data: {
    containerNo: '',    // 集装箱号
    baseInfo: '',       // 基本信息
    stateInfo: { // 状态信息
      rightTitle: '',
      jcTime: '',
      baoguan: {time: '', data: '', nowData: ''},
      chayan: {time: '', data: '', nowData: ''},
      zhuanguan: {time: '', data: '', nowData: ''},
      lh_xcTime: '',
      cangdan: {time: '', data: '', nowData: ''},
      ljTime: '',
      dgTime: '',
      fxTime: '',
      ccTime: '',

    },

    isRightInfo: true,  // 状态/轨迹的切换

  },
  methods: {
    // 通用获取数据
    getHttp: function (url, par, succFn) {
      axios.get(url, { params: par })
        .then(function (res) {

          res = res.data

          if (res.code !== 0) {
            // layer.msg('获取数据失败,code:' + res.code)
            return
          }

          succFn(res)

        }.bind(this))
        .catch(function (err) {
          console.log(err)
        }.bind(this))
    },

    // 获取 基本信息 成功后执行的函数
    getBaseInfo: function (res) {
      console.log('基本信息：');
      console.log(res);

      if (!res.data || _.isEmpty(res.data)) {
        console.log('基本信息 数据集为空。');
        return;
      }

      // 整理铅封号
      if (res.data.sealNo1) {
        res.data.sealNo = res.data.sealNo1
      } else if (res.data.sealNo2) {
        res.data.sealNo = res.data.sealNo2
      } else if (res.data.sealNo3) {
        res.data.sealNo = res.data.sealNo3
      } else if (res.data.sealNo4) {
        res.data.sealNo = res.data.sealNo4
      } else {
        res.data.sealNo = ''
      }
      // 残损
      if (res.data.damMark === 1) {
        res.data.damMark = '残损'
      } else if (res.data.damMark === 0) {
        res.data.damMark = '正常'
      }
      // 温度
      res.data.curTemp = res.data.curTemp? res.data.curTemp + (res.data.tempUnit? res.data.tempUnit: ''): '';
      // 贸易
      if (res.data.tradeMark === 'F') {
        res.data.tradeMark = '外贸'
      } else if (res.data.tradeMark === 'D') {
        res.data.tradeMark = '内贸'
      }
      // 空重
      if (res.data.efMark === 'E') {
        res.data.efMark = '空箱'
      } else if (res.data.efMark === 'H') {
        res.data.efMark = '重箱'
      }

      this.baseInfo = res.data

      // 是进口I 还是出口E？// todo: 获取状态信息
      if (this.baseInfo.ieMark === 'I') {
        this.getDG();  // 抵港
        this.getLH();  // 卸船.就是理货
        this.getCD();  // 舱单
        this.getCG();  // 报关单
        this.getZG();  // 转关单
        this.getCY();  // 查验单
        this.getFX();  // 海关放行
        this.getCC();  // 出场
      } else if (this.baseInfo.ieMark === 'E') {
        this.getJC();  // 进场
        this.getCG();  // 报关单
        this.getCY();  // 查验单
        this.getZG();  // 转关单
        this.getLH();  // 理货
        this.getCD();  // 舱单
        this.getLJ();  // 离境


      } else {
        console.log('此集装箱没有进出口标志 ieMark, 无法继续查询。');
      }

    },

    // get获取 进场时间
    getJC: function () {
      var url = '../customs/getInGateTime';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('进场时间：');
        console.log(res);

        if (!res.data || _.isEmpty(res.data)) {
          console.log('进场时间 数据集为空。');
          this.stateInfo.jcTime = '无'
          return;
        }

        res.data = del2017DateObj(res.data, 'IN_GAT_TIM'); // 过滤
        if (res.data.isShow) {
          this.stateInfo.jcTime = res.data.IN_GAT_TIM || '无'
        } else {
          this.stateInfo.jcTime = res.data.IN_GAT_TIM || '无最新进场时间'
        }


      }.bind(this))
    },
    // get获取 报关单
    getCG: function () {
      var url = '../customs/getImportEntries';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('报关单：');
        console.log(res);

        if (!res.data || res.data.length <= 0) {
          console.log('报关单 数据集为空。');
          this.stateInfo.baoguan.time = '无'  // 取的是 申报时间，设置报关单为 无
          return;
        }

        res.data = del2017Date(res.data, 'd_date'); // 过滤

        for(var i = 0; i <= res.data.length; i++) {
          if (res.data[i].isShow) {
            this.stateInfo.baoguan.time = res.data[i].d_date;
            this.stateInfo.baoguan.data = res.data;
            break;
          }
          if(i === res.data.length-1) {
            this.stateInfo.baoguan.time = '无最新报关单'
          }
        }

      }.bind(this))
    },
    // get获取 查验单
    getCY: function () {
      var url = '../customs/getImportCheckList';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('查验单：');
        console.log(res);

        if (!res.data || res.data.length <= 0) {
          console.log('查验单 数据集为空。');
          this.stateInfo.chayan.time = '无'  // 取的是 申报时间，设置报关单为 无
          return;
        }

        res.data = del2017Date(res.data, 'd_date'); // 过滤

        for(var i = 0; i <= res.data.length; i++) {
          if (res.data[i].isShow) {
            this.stateInfo.chayan.time = res.data[i].d_date;
            this.stateInfo.chayan.data = res.data;
            break;
          }
          if(i === res.data.length-1) {
            this.stateInfo.chayan.time = '无最新查验单'
          }
        }

      }.bind(this))
    },
    // get获取 转关单
    getZG: function () {
      var url = '../customs/getTransferOrder';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('转关单：');
        console.log(res); // 返回的是个对象、不是数组

        if (!res.data || _.isEmpty(res.data)) {
          console.log('转关单 数据集为空。');
          this.stateInfo.zhuanguan.time = '无'  // 取的是 录入时间，设置报关单为 无
          return;
        }

        // 转为数组
        var zhuanguan = res.data;
        res.data = [];
        res.data[0] = zhuanguan;

        res.data = del2017Date(res.data, 'INPUT_TIME'); // 过滤

        for(var i = 0; i <= res.data.length; i++) {
          if (res.data[i].isShow) {
            this.stateInfo.zhuanguan.time = res.data[i].INPUT_TIME;
            this.stateInfo.zhuanguan.data = res.data;
            break;
          }
          if(i === res.data.length-1) {
            this.stateInfo.zhuanguan.time = '无最新转关单'
          }
        }

      }.bind(this))
    },
    // get获取 E 理货时间 I 卸船时间
    getLH: function () {
      var url = '../customs/getShipWorkTime';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('E理货时间（I卸船时间）：');
        console.log(res);

        if (!res.data || _.isEmpty(res.data)) {
          if (this.baseInfo.ieMark === 'I') {
            console.log('卸船时间 数据集为空。');
          } else {
            console.log('理货时间 数据集为空。');
          }
          this.stateInfo.lh_xcTime = '无'
          return;
        }

        res.data = del2017DateObj(res.data, 'SHIP_WORK_TIM'); // 过滤
        if (res.data.isShow) {
          this.stateInfo.lh_xcTime = res.data.SHIP_WORK_TIM || '无'
        } else {
          var text = this.baseInfo.ieMark === 'I' ? '无最新卸船时间' : '无最新理货时间'
          this.stateInfo.lh_xcTime = res.data.SHIP_WORK_TIM || text
        }


      }.bind(this))
    },
    // get获取 海关舱单
    getCD: function () {
      var url = '../customs/getNewManifestInfosByContainer';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('海关舱单：');
        console.log(res);

        if (!res.data || res.data.length <= 0) {
          console.log('海关舱单 数据集为空。');
          this.stateInfo.cangdan.time = '无'  // 取的是 创建时间，设置报关单为 无
          return;
        }

        res.data = del2017Date(res.data, 'GEN_DATE'); // 过滤

        for(var i = 0; i <= res.data.length; i++) {
          if (res.data[i].isShow) {
            this.stateInfo.cangdan.time = res.data[i].GEN_DATE;
            this.stateInfo.cangdan.data = res.data;
            break;
          }
          if(i === res.data.length-1) {
            this.stateInfo.cangdan.time = '无最新海关舱单'
          }
        }

      }.bind(this))
    },
    // get获取 离境时间
    getLJ: function () {
      var url = '../customs/getLeaveTime';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('离境时间：');
        console.log(res);

        if (!res.data || _.isEmpty(res.data)) {
          console.log('离境时间 数据集为空。');
          this.stateInfo.ljTime = '无'
          return;
        }

        res.data = del2017DateObj(res.data, 'RTD'); // 过滤
        if (res.data.isShow) {
          this.stateInfo.ljTime = res.data.RTD || '无'
        } else {
          this.stateInfo.ljTime = res.data.RTD || '无最新离境时间'
        }


      }.bind(this))
    },
    // get获取 抵港时间
    getDG: function () {
      var url = '../customs/getImportContainerArrivalTime';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('抵港时间：');
        console.log(res);

        if (!res.data || _.isEmpty(res.data)) {
          console.log('抵港时间 数据集为空。');
          this.stateInfo.dgTime = '无'
          return;
        }

        res.data = del2017DateObj(res.data, 'RTD'); // 过滤
        if (res.data.isShow) {
          this.stateInfo.dgTime = res.data.RTD || '无'
        } else {
          this.stateInfo.dgTime = res.data.RTD || '无最新抵港时间'
        }


      }.bind(this))
    },
    // get获取 海关放行时间
    getFX: function () {
      var url = '../customs/getImportReleaseMsg';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('海关放行时间：');
        console.log(res);

        if (!res.data || _.isEmpty(res.data)) {
          console.log('海关放行时间 数据集为空。');
          this.stateInfo.fxTime = '无'
          return;
        }

        res.data = del2017DateObj(res.data, 'REL_DATE'); // 过滤
        if (res.data.isShow) {
          this.stateInfo.fxTime = res.data.REL_DATE || '无'
        } else {
          this.stateInfo.fxTime = res.data.REL_DATE || '无最新海关放行时间'
        }


      }.bind(this))
    },
    // get获取 出场时间
    getCC: function () {
      var url = '../customs/getOutGateTime';
      var par = {
        containerNo: this.containerNo,
        ieMark: this.baseInfo.ieMark
      }
      this.getHttp(url, par, function(res) {
        console.log('出场时间：');
        console.log(res);

        if (!res.data || _.isEmpty(res.data)) {
          console.log('出场时间 数据集为空。');
          this.stateInfo.ccTime = '无'
          return;
        }

        res.data = del2017DateObj(res.data, 'OUT_GAT_TIM'); // 过滤
        if (res.data.isShow) {
          this.stateInfo.ccTime = res.data.OUT_GAT_TIM || '无'
        } else {
          this.stateInfo.ccTime = res.data.OUT_GAT_TIM || '无最新出场时间'
        }


      }.bind(this))
    },

    // 点击单号展示对应的单
    showTableDetail: function (eve, type, index) {
      var domArr = document.getElementsByClassName("tableA");
      domArr.classList.remove('active');
      eve.target.classList.add('active');

      this.stateInfo.rightTitle = type;
      if (type === '海关舱单') {
        this.stateInfo.cangdan.newData = this.stateInfo.cangdan.data[index]
      } else if (type === '报关单') {
        this.stateInfo.baoguan.newData = this.stateInfo.baoguan.data[index]
      } else if (type === '查验单') {
        this.stateInfo.chayan.newData = this.stateInfo.chayan.data[index]
      } else if (type === '转关单') {
        this.stateInfo.zhuanguan.newData = this.stateInfo.zhuanguan.data[index]
      }
    },



    // 切换状态和轨迹信息
    checkRightInfo: function (eve) {
      if (eve.target.nodeName !== 'SPAN' &&
        _.indexOf(eve.target.classList, 'active') !== -1) {
        return
      }

      var type = eve.target.getAttribute('data-value');
      if (type === 'state') {
        this.isRightInfo = true
      } else if (type === 'locus') {
        this.isRightInfo = false

        setTimeout(() => { // 等dom渲染完
          this.trackFn(); // 描绘轨迹
        }, 10)
      }
    },


    // 描绘轨迹
    trackFn: function () {
      var box = document.getElementById('track-box');
      // 渲染后才能获取到准确的宽高 clientWidth包含了paddding 不可用
      var w = parseFloat(window.getComputedStyle(box).width) - parseFloat(window.getComputedStyle(box).paddingLeft)*2;
      var h = parseFloat(window.getComputedStyle(box).height) - parseFloat(window.getComputedStyle(box).paddingTop)*2;
      var size = [3112, 1809]; // 原图px大小
      var berth = [[260, 40], [770, 40], [1280, 40], [1770, 40], [2280, 40], [2780, 40]]; // 泊位
      var scene = { // 堆场
        "AA": [500, 232],
        "AB": [500, 272],
        "AC": [500, 320],
        "AD": [500, 356],
        "AE": [500, 405],
        "AF": [500, 442],
        "AG": [500, 496],
        "AH": [500, 532],
        "AI": [500, 582],
        "AJ": [500, 622],
        "AK": [500, 722], // 图中有点问题?
        "AL": [500, 762], // 图中有点问题?
        "AM": [500, 808],
        "AN": [500, 846],
        "AO": [500, 896],
        "AP": [500, 932],
        "AQ": [500, 982],
        "AR": [500, 1022],
        "AS": [500, 1068],
        "AT": [500, 1112],

        "BA": [850, 232],
        "BB": [850, 272],
        "BC": [850, 320],
        "BD": [850, 356],
        "BE": [850, 405],
        "BF": [850, 442],
        "BG": [850, 496],
        "BH": [850, 532],
        "BI": [850, 582],
        "BJ": [850, 622],
        "BK": [850, 722],
        "BL": [850, 762],
        "BM": [850, 808],
        "BN": [850, 846],
        "BO": [850, 896],
        "BP": [850, 932],
        "BQ": [850, 982],
        "BR": [850, 1022],
        "BS": [850, 1068],
        "BT": [850, 1112],

        "CA": [1200, 232],
        "CB": [1200, 272],
        "CC": [1200, 320],
        "CD": [1200, 356],
        "CE": [1200, 405],
        "CF": [1200, 442],
        "CG": [1200, 496],
        "CH": [1200, 532],
        "CI": [1200, 582],
        "CJ": [1200, 622],
        "CK": [1200, 722],
        "CL": [1200, 762],
        "CM": [1200, 808],
        "CN": [1200, 846],
        "CO": [1200, 896],
        "CP": [1200, 932],
        "CQ": [1200, 982],
        "CR": [1200, 1022],
        "CS": [1200, 1068],
        "CT": [1200, 1112],

        "DA": [1560, 232],
        "DB": [1560, 272],
        "DC": [1560, 320],
        "DD": [1560, 356],
        "DE": [1560, 405],
        "DF": [1560, 442],
        "DG": [1560, 496],
        "DH": [1560, 532],
        "DI": [1560, 582],
        "DJ": [1560, 622],
        "DK": [1560, 722],
        "DL": [1560, 762],
        "DM": [1560, 808],
        "DN": [1560, 846],
        "DO": [1560, 896],
        "DP": [1560, 932],
        "DQ": [1560, 982],
        "DR": [1560, 1022],
        "DS": [1560, 1068],
        "DT": [1560, 1112],

        "EA": [1920, 232],
        "EB": [1920, 272],
        "EC": [1920, 320],
        "ED": [1920, 356],
        "EE": [1920, 405],
        "EF": [1920, 442],
        "EG": [1920, 496],
        "EH": [1920, 532],
        "EI": [1920, 582],
        "EJ": [1920, 622],
        "EK": [1920, 722],
        "EL": [1920, 762],
        "EM": [1920, 808],
        "EN": [1920, 846],
        "EO": [1920, 896],
        "EP": [1920, 932],
        "EQ": [1920, 982],
        "ER": [1920, 1022],
        "ES": [1920, 1068],
        "ET": [1920, 1112],

        "FA": [2270, 232],
        "FB": [2270, 272],
        "FC": [2270, 320],
        "FD": [2270, 356],
        "FE": [2270, 405],
        "FF": [2270, 442],
        "FG": [2270, 496],
        "FH": [2270, 532],
        "FI": [2270, 582],
        "FJ": [2270, 622],
        "FK": [2270, 722],
        "FL": [2270, 762],
        "FM": [2270, 808],
        "FN": [2270, 846],
        "FO": [2270, 896],
        "FP": [2270, 932],
        "FQ": [2270, 982],
        "FR": [2270, 1022],
        "FS": [2270, 1068],
        "FT": [2270, 1112],

        "GA": [2620, 232],
        "GB": [2620, 272],
        "GC": [2620, 320],
        "GD": [2620, 356],
        "GE": [2620, 405],
        "GF": [2620, 442],
        "GG": [2620, 496],
        "GH": [2620, 532],
        "GI": [2620, 582],
        "GJ": [2620, 622],
        "GK": [2620, 722],
        "GL": [2620, 762],
        "GM": [2620, 808],
        "GN": [2620, 846],
        "GO": [2620, 896],
        "GP": [2620, 932],
        "GQ": [2620, 982],
        "GR": [2620, 1022],
        "GS": [2620, 1068],
        "GT": [2620, 1112],

        "HA": [2980, 232],
        "HB": [2980, 272],
        "HC": [2980, 320],
        "HD": [2980, 356],
        "HE": [2980, 405],
        "HF": [2980, 442],
        "HG": [2980, 496],
        "HH": [2980, 532],
        "HI": [2980, 582],
        "HJ": [2980, 622],
        "HK": [2980, 722],
        "HL": [2980, 762],
        "HM": [2980, 808],
        "HN": [2980, 846],
        "HO": [2980, 896],
        "HP": [2980, 932],
        "HQ": [2980, 982],
        "HR": [2980, 1022],
        "HS": [2980, 1068],
        "HT": [2980, 1112],

        "XA": [500, 1206],
        "XB": [500, 1252],
        "XC": [500, 1308],
        "XD": [500, 1344],
        "XE": [850, 1206],
        "XF": [850, 1252],
        "XG": [850, 1308],
        "XH": [850, 1344],
        "XI": [1200, 1206],
        "XJ": [1200, 1252],
        "XK": [1200, 1308],
        "XL": [1200, 1344],
        "XM": [1560, 1206],
        "XN": [1560, 1252],
        "XO": [1560, 1308],
        "XP": [1560, 1344],
        "XQ": [1920, 1206],
        "XR": [1920, 1252],
        "XS": [1920, 1308],
        "XT": [1920, 1344],
        "XU": [2270, 1206],
        "XV": [2270, 1252],
        "XW": [2270, 1308],
        "XX": [2270, 1344],
        "XY": [2620, 1206],
        "XZ": [2620, 1252]
      }
      var examine = [700, 1570]; // 集中查验区
      var exit = [1652, 1458]; // 出港自动电子闸口
      var entrance = [2694, 1458]; // 进港自动电子闸口
      // console.log(w);
      // console.log(h);

      // canvas画轨迹
      var canvas = document.getElementById('canvas');
      canvas.width = w;
      canvas.height = h;
      var context = canvas.getContext("2d");

      // 画点
      function drawArc(x, y) {
        context.strokeStyle = '#ffffff';
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI, true);
        context.fillStyle = "#ff5a00";
        context.fill();
        context.stroke();
      }

      // 画线
      function drawLine(x, y, toX, toY) {
        context.setLineDash([5, 5]);
        context.lineWidth = 2;
        context.strokeStyle = '#ff5a00';
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(toX, toY);
        context.stroke();
      }

      // 画时间
      function drawTime(x, y, time) {
        context.font = 'bold 0.9em Microsoft Yahei';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.setLineDash([5, 0]);
        context.lineWidth = 0.2;
        context.strokeStyle = "#fff";
        context.fillStyle = "#fb5400";
        context.fillText(time, x, y + 15);
        context.strokeText(time, x, y + 15);
      }

      // 画坐标图标
      function drawImg(x, y) {
        var img = new Image();
        img.src = "../static/imgs/bo_gps.png"; // 地址肯要改
        img.width = 60;
        img.onload = function () {
          context.drawImage(img, x - (117 / 2), y - 117);
        };
      }

      // 先画圆再画线、图、字  x = (a/b) * w
      var d1 = [berth[0][0] / size[0] * w, berth[0][1] / size[1] * h];
      var d2 = [scene["AA"][0] / size[0] * w, scene["AA"][1] / size[1] * h];
      var d3 = [examine[0] / size[0] * w, examine[1] / size[1] * h];
      var d4 = [exit[0] / size[0] * w, exit[1] / size[1] * h];
      var d5 = [entrance[0] / size[0] * w, entrance[1] / size[1] * h];
      drawArc(d1[0], d1[1]);
      drawArc(d2[0], d2[1]);
      drawArc(d3[0], d3[1]);
      drawArc(d4[0], d4[1]);
      drawArc(d5[0], d5[1]);
      drawLine(d1[0], d1[1], d2[0], d2[1]);
      drawLine(d2[0], d2[1], d3[0], d3[1]);
      drawLine(d3[0], d3[1], d4[0], d4[1]);
      drawLine(d4[0], d4[1], d5[0], d5[1]);
      drawTime(d2[0], d2[1], '2018-04-10 18:00');
      drawImg(d3[0], d3[1]);
    }


  },
  created: function () {
    this.containerNo = getUrlParam('containerNo') || ''; // 集装箱号
    // get获取 基本信息
    var url = '../pier/getContainerInfoByContainerNo';
    // var url = 'data/getContainerInfoByContainerNo.json';
    var par = { containerNo: this.containerNo }
    this.getHttp(url, par, this.getBaseInfo)

  }

});
