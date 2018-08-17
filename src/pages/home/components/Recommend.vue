<template>
  <div>
    <div class="title">热销推荐</div>
    <ul>
      <li class="item border-bottom" v-for="item of recommendList" :key="item.id">
        <img class="item-img" :src="item.imgUrl" />
        <div class="item-info">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-desc">{{ item.desc }}</p>
          <button class="item-button">查看详情</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HomeRecommend',
  props: ['recommendList']
}
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'
.title
  margin-top: 0.2rem
  line-height: 0.8rem
  background: #eeeeee
  text-indent: 0.2rem // 缩进
.item
  display: flex
  height: 1.9rem
  overflow: hidden
  .item-img
    width: 1.6rem
    height: 1.6rem
    padding: 0.15rem
  .item-info
    flex: 1
    min-width: 0
    padding: 0.15rem
    .item-title
      line-height: 0.54rem
      font-size: 0.32rem
      ellipsis()
    .item-desc
      line-height: 0.4rem
      color: #ccc
      ellipsis()
    .item-button
      background: #ff9300
      padding: 0 0.2rem
      border-radius: 0.06rem
      color: #ffffff
      margin-top: 0.16rem
      line-height: 0.44rem
      font-weight: bold
</style>
