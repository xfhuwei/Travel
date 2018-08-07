<template>
  <div class="icons">
    <swiper>
      <swiper-slide v-for="(page, index) of pages" :key="index">
        <div class="icon" v-for="item of page" :key="item.id">
          <div class="icon-img">
            <img class="icon-img-content"
              :src="item.imgUrl"/>
          </div>
          <p class="icon-desc">{{ item.desc }}</p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'HomeIcons',
  data () {
    return {
      iconList: [
        {
          id: '0001',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '景点门票'
        },
        {
          id: '0002',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '滑雪季'
        },
        {
          id: '0003',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '泡温泉'
        },
        {
          id: '0004',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '动植物园'
        },
        {
          id: '0005',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '滑雪季2'
        },
        {
          id: '0006',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '滑雪季3'
        },
        {
          id: '0007',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '滑雪季4'
        },
        {
          id: '0008',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '滑雪季5'
        },
        {
          id: '0009',
          imgUrl: 'https://gw.alicdn.com/tps/TB1d30fPVXXXXbGXXXXXXXXXXXX-183-144.png_.webp',
          desc: '一日游'
        }
      ]
    }
  },
  computed: {
    pages () { // 计算属性
      /*
      const pages = []
      this.iconList.forEach((item, index) => {
        const page = Math.floor(index / 8)
        if (!pages[page]) {
          pages[page] = []
        }
        pages[page].push(item)
      })
      return pages
      */

      // 切分数组
      return this.$_.chunk(this.iconList, 8)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variables.styl';
@import '~styles/mixins.styl';
  .icons >>> .swiper-container
    height 0
    padding-bottom 50%
  .icon
    width 25%
    float left
    height 0
    padding-bottom 25%
    overflow hidden
    position relative
    .icon-img
      position absolute
      top 0
      left 0
      right 0
      bottom .44rem
      box-sizing border-box
      padding-bottom .12rem
      .icon-img-content
        height 100%
        display block
        margin 0 auto
    .icon-desc
      position absolute
      left 0
      right 0
      bottom 0
      line-height .44rem
      height .44rem
      color $darkTextColor
      text-align center
      ellipsis()
</style>
