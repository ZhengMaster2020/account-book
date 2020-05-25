<template>
  <div id="app">
    <transition name="el-fade-in-linear">
      <h1 v-if="show" class="title">哩犼记账小系统</h1>
    </transition>
    <el-tabs
      v-model="tabName"
      class="tabs"
      tab-position="left"
      style="height: auto;"
      @tab-click="handleClick">
      <el-tab-pane label="用户账本" name="account"><Home/></el-tab-pane>
      <el-tab-pane label="收支统计" name="statistics"><Statistics/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Statistics from './components/Statistics.vue'

export default {
  name: 'App',
  data() {
    return {
      show: true,
      tabName: 'account',
    }
  },
  components: {
    Home,
    Statistics
  },
  methods: {
    handleClick(tab) {
      if(tab.name === 'statistics') {
        this.show = false
      } else {
        this.show = true
      }
    }
  }
}
</script>

<style lang="less">
// body {
//   // overflow: hidden;
// }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  width: 88vw;
  .title{
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 19px;
    font-weight: 450;
    color: #999;
  }
  .el-tabs__content {
    // width: 80vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
