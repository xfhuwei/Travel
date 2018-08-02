<template>
  <div>
    <transition name="fade">
      <h1 v-if="isShow" class="test_title">{{ message }}</h1>
    </transition>
    <p class="inp">
      <input class="ipt" type="text" v-model="inputValue">
      <button class="btn" @click="handleAdd">添加</button>
    </p>
    <ul class="list">
      <item v-for="(v, i) of inputArr" @handleDel="handleDel"
      :key="i" :item="v" :index="i"></item>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Test',
  components: {
    'item': {
      template: `
        <li>
          <b>{{ index+1 }})</b>
          <span>{{ item }} ;</span>
          <button class="btn delbtn" @click="childHandleDel(index)">删除</button>
        </li>
      `,
      props: ['index', 'item'],
      methods: {
        childHandleDel: function (i) {
          this.$emit('handleDel', i)
        }
      }
    }
  },
  data () {
    return {
      message: 'This is vue page test',
      inputValue: '',
      inputArr: [],
      timer: null,
      showI: 0,
      isShow: true
    }
  },
  watch: {
    inputArr: function (newVal, oldVal) {
      clearInterval(this.timer)
      this.timer = null
      let i = this.showI >= this.inputArr.length ? 0 : this.showI
      this.msgChange(i)
    }
  },
  methods: {
    handleAdd: function () {
      if (!this.inputValue) {
        alert('请先输入文字')
        return
      }
      this.inputArr.push(this.inputValue)
      this.inputValue = ''
    },
    handleDel: function (i) {
      if (confirm('你确定要删除当前第 ' + (i * 1 + 1) + ' 项吗')) {
        this.inputArr.splice(i, 1)
      }
    },
    msgChange: function (i) {
      this.showI = i || 0
      if (this.inputArr.length > 0) {
        this.timer = setInterval(() => {
          this.isShow = false
          setTimeout(() => {
            this.message = this.inputArr[this.showI]
            this.isShow = true
            if (this.showI < this.inputArr.length - 1) {
              this.showI += 1
            } else {
              this.showI = 0
            }
          }, 1610)
        }, 4000)
      }
    }
  }
}
</script>

<style>

  .fade-enter-active {
    transition: all .6s ease;
  }
  .fade-leave-active {
    transition: all 1.6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to {
    transform: translateY(-30px);
    opacity: 0;
  }

  .test_title {
    color: #e4393c;
    position: absolute;
    left: 0;
    width: 100%;
  }
  .list {
    width: 34%;
    margin: 10px 33%;
    text-align: left;
    border: 1px solid rgb(98, 248, 98);
    padding: 8px;
    list-style: none;
    border-radius: 4px;
    min-height: 88px;
  }
  .list li:not(:last-child) {
    border-bottom: 1px dotted rgb(98, 248, 98);
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
  .list li>b {
    color: rgb(98, 248, 98);
  }
  .btn {
    outline: 0;
    border: 0;
    background: rgb(98, 248, 98);
    transition: background linear .123s;
    color: #fff;
    cursor: pointer;
    box-sizing: border-box;
    height: 28px;
    width: 60px;
    text-align: center;
    line-height: 26px;
    font-size: 14px;
    border-radius: 4px;
    float: left;
  }
  .btn:hover {
    background: rgb(9, 241, 9);
  }
  .ipt {
    box-sizing: border-box;
    height: 28px;
    width: 138px;
    outline: 0;
    padding: 0 10px;
    border: 1px solid rgb(98, 248, 98);
    float: left;
    transition: all linear .123s;
    border-radius: 4px;
    margin-right: 10px;
  }
  .ipt:focus {
    border-color: rgb(9, 241, 9);
    box-shadow: 0 0 1px rgb(9, 241, 9);
  }
  .inp:after {
    content: '';
    display: block;
    clear: both;
  }
  .inp {
    width: 34%;
    margin: 0 33%;
    text-align: left;
    padding-top: 80px
  }
  .delbtn {
    width: 40px;
    height: 22px;
    line-height: 22px;
    background-color: rgb(233, 80, 69);
    float: none;
    font-size: 12px;
  }
  .delbtn:hover {
    background-color: rgb(212, 34, 21);
  }
</style>
