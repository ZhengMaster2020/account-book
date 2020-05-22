<template>
  <div class="home">
    <!-- <div class="summary">
      <h3 class="tile">收支表</h3>
      <el-table
        :data="summaryData">
        <el-table-column
          type="index"
          label="类型"
          width="50"/>
        <el-table-column
          prop="time"
          label="日期"/>
      </el-table>
    </div> -->
    <el-table
      ref="renderTable"
      class="table"
      cell-class-name="cell"
      header-cell-class-name="cell-header"
      v-loading="loading"
      :data="accountData">
      <el-table-column
        type="index"
        width="80"/>
      <el-table-column
        width="100"
        prop="type"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <div class="type">
            <i :class="['type-icon', { 'pay-icon': scope.row.type === '支出' }]"></i>
            {{ scope.row.type }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="time"
        align="center"
        label="日期"/>
      <el-table-column
        prop="category"
        align="center"
        label="分类"/>
      <el-table-column
        prop="amount"
        align="center"
        label="金额">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.type === '支出' ? '#14ba89' : '#f1523a' }">
            {{ scope.row.amount }}
          </span>
        </template>
      </el-table-column>
      <div v-show="accountData.length >= 12" slot="append" class="nomore" >
        <span v-if="isFinish" class="loadEnd">
          <span class="line">
            ————</span>&nbsp;&nbsp;&nbsp;&nbsp;没有更多&nbsp;&nbsp;&nbsp;&nbsp;<span class="line">————</span>
          </span>
      </div>
      <div slot="empty" class="nodata">
        <img alt="nodata" src="@/assets/images/nodata.png" height="40%" width="30%">
        <p>暂无数据</p>
    </div>
    </el-table>
  </div>
</template>

<script>
// import { loading } from 'element-ui'
import moment from 'moment'
import { numberWithCommas } from '@/utils'

export default {
  name: 'Home',
  data() {
    return {
      scrollTop: 0,
      currentIndex: 0,
      isFinish: false,
      isMore: false,
      loading: false,
      initData: [],
      summaryData: [],
      accountData: [],
      billData: [],
      categories: []
    }
  },
  components: {},
  created() {
    this.fetchData()
  },
  mounted() {
    this.$nextTick(() => {
      const renderTableDOM = this.$refs.renderTable.bodyWrapper
      renderTableDOM.addEventListener('scroll', position => {
        const { scrollTop, clientHeight, scrollHeight } = position.target
        if (Math.round(scrollTop) + Math.round(clientHeight) >= Math.round(scrollHeight) - 10
            && scrollTop !== 0) {
          this.loadMore()
        }
      })
    })
  },
  watch: {
  },
  methods: {
    async fetchData() {
      this.loading = true
      const bill = await this.$http.get('/api/file/bill')
      const categories = await this.$http.get('/api/file/categories')
      this.dataFormat(bill.data, categories.data)
      this.loading = false
    },

    // 下拉加载数据
    loadMore() {
      /**
       * ① scrollTop 获取滚动条当前的位置
       * ② clientHeight 获取当前可视范围的高度
       * ③ scrollHeight 获取文档完整的高度
       * 原理 scrollHeight - scrollTop = clientHeight
       */
      if (this.currentIndex > this.initData.length -1) return this.isFinish = true
      this.loading = true
      this.initData
        .slice(this.currentIndex, this.currentIndex+12)
        .forEach(item => this.accountData.push(item))
      this.currentIndex += 12
      setTimeout(() => {
        this.loading = false
      }, 300);
    }, 

    // 数据格式转换
    dataFormat(bill, category) {
      bill.forEach(item => {
        item.time = this.dateFormat(item.time)
        item.amount = `￥${numberWithCommas(item.amount)}`
        item.type === '0' ? item.type = '支出' : item.type = '收入'
        category.forEach(ele => {
          ele.id === item.category ? item.category = ele.name : ''
        })
      })
      this.accountData = bill.slice(this.currentIndex, this.currentIndex+12)
      this.currentIndex += 12
      this.initData = bill
    },
    dateFormat(time){
      return moment(Number(time)).format('yyyy-MM-DD hh:mm:ss')
    }
  },
}
</script>

<style lang="less" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  width: 1000px;
  min-height: 50vh;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 50px;
  .table {
    border: 1px solid #eaeefb;
    border-top: none;
    .type {
      display: flex;
      align-items: center;
      &-icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: middle;
        position: relative;
        top: -1px;
        margin-right: 7px;
        background: url(../assets/images/acttype.png) 0 0 no-repeat;
        background-size: 15px auto;
      }
      .pay-icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: middle;
        position: relative;
        top: -1px;
        margin-right: 7px;
        background: url(../assets/images/acttype.png) 0 0 no-repeat;
        background-size: 15px auto;
        background-position: 0 -15px;
      }
    }
  }
  .summary {
    display: flex;
    width: 100%;
    height: 145px;
    .title {
      color: #312f2c;
      width: 100%;
      padding-bottom: 20px;
      font-size: 18px;
      color: #312f2c;
      font-weight: normal;
    }
  }
  .nodata {
    margin-top: 50px;
  }
  .nomore {
    margin: 20px;
    color: #999;
  }
}
</style>
<style lang="less">
.home { 
  .cell-header {
    height: 30px;
    font-weight: normal;
    border-top: 1px solid #eaeaec;
    border-bottom: 1px solid #eaeaec;
    background-image: linear-gradient(180deg,rgba(255,255,255,0.92) 0,rgba(250,250,252,0.92) 100%);
  }
  .cell {
    color: #312f2c;
    font-size: 12px;
  }
  .el-table_1_column_1 {
    background-color: #fafafc;
  }
  .el-table__body-wrapper {
    height: 520px;
    overflow-y: scroll;
  }
}
</style>