<template>
  <div>
    <home-header></home-header>
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
import { mapState } from 'vuex'
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
      lastCity: '',
      mainData: ''
    }
  },
  computed: {
    ...mapState(['city'])
  },
  methods: {
    getHomeInfo () {
      axios.get('/api/index.json?city=' + this.city)
        .then(this.getHomeInfoSucc)
    },
    getHomeInfoSucc (res) {
      console.log(res)
      res = res.data
      if (res.ret && res.data) {
        this.mainData = res.data
      }
    }
  },
  mounted () { // 钩子，在 dom 渲染完成后执行
    this.lastCity = this.city
    this.getHomeInfo()
  },
  activated () { // 钩子，配合 keep-alive 缓存标签使用
    if (this.lastCity !== this.city) {
      this.lastCity = this.city
      this.getHomeInfo()
    }
  }
}
</script>

<style>
</style>
