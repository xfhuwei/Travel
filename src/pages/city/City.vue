<template>
  <div>
    <city-header></city-header>
    <city-search></city-search>
    <city-list></city-list>
    <city-alphabet></city-alphabet>
  </div>
</template>

<script>
import CityHeader from './components/Header'
import CitySearch from './components/Search'
import CityList from './components/List'
import CityAlphabet from './components/Alphabet'
import axios from 'axios'
export default {
  name: 'City',
  components: {
    CityHeader,
    CitySearch,
    CityList,
    CityAlphabet
  },
  methods: {
    getCityData () {
      axios.get('/api/city.json')
        .then(function (res) {
          console.log(res)
        })
    }
  },
  mounted () {
    this.getCityData()
  }
}
</script>

<style lang="stylus" scoped>
</style>
