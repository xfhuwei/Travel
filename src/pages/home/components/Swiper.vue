<template>
  <div class="wrapper">
    <swiper :options="swiperOption">
      <swiper-slide v-for="item of swiperList" :key="item.id">
        <img class="swiper-img" :src="item.imgUrl">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'HomeSwiper',
  props: ['swiperList'],
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          delay: 3000
        },
        loop: true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>  // scoped 样式当前仅组件可用
  .wrapper >>> .swiper-pagination-bullet-active  // 样式穿透 >>>
    background #fff
  .wrapper
    overflow hidden
    width 100%
    height 0
    padding-bottom (200/640*100)% // 图片宽高百分比
    background #ccc
    .swiper-img
      width 100%

</style>
