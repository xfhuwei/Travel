<template>
  <div>
    <home-header :city="mainData.city"></home-header>
    <home-Swiper :swiperList="mainData.swiperList"></home-Swiper>
    <home-Icons :iconList="mainData.iconList"></home-Icons>
    <home-recommend :recommendList="mainData.recommendList"></home-recommend>
    <home-weekend :weekendList="mainData.weekendList"></home-weekend>
  </div>
</template>

<script>
import HomeHeader from './components/Header'
import HomeSwiper from './components/Swiper'
import HomeIcons from './components/Icons'
import HomeRecommend from './components/Recommend'
import HomeWeekend from './components/Weekend'
import axios from 'axios'
export default {
  name: 'Home',
  components: {
    HomeHeader,
    HomeSwiper,
    HomeIcons,
    HomeRecommend,
    HomeWeekend
  },
  data () {
    return {
      mainData: ''
    }
  },
  methods: {
    getHomeInfo () {
      axios.get('/api/index.json')
        .then(this.getHomeInfoSucc)
    },
    getHomeInfoSucc (res) {
      console.log(res)
      if (res.data.ret) {
        this.mainData = res.data.data
      }
    }
  },
  mounted () { // 钩子，在 dom 渲染完成后执行
    this.getHomeInfo()
  }
}
</script>

<style>
</style>
