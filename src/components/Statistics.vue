<template>
  <div class="statistics">
    <h2 class="title">统计并展示所选月份的收入和支出总金额</h2>
    <div class="content">
      <el-date-picker
        v-model="month"
        type="month"
        format="yyyy 年 MM 月" 
        value-format="timestamp"
        placeholder="选择月份查看详情">
      </el-date-picker>
      <div class="canvans">
        <div id="line" style="width: 900px;height:500px;margin-bottom:50px"></div>
        <div id="pie" style="width: 600px;height:400px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

export default {
  name: '',
  data() {
    return {
      month: moment(new Date()),
      categoryArr: [],
      incomeArr: [],
      expendsesArr: [],
      incomeCategory: [],
      expendsesCategory: [],
      pieIncome: []
    }
  },
  watch: {
    month(newVal) {
      // console.log(newVal)
      if (newVal)
      this.histogram()
      this.pie()
    }
  },
  computed: {
    ...mapState(['categories', 'income', 'expenses']),
    ...mapGetters(['incomeStatistics'])
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.pieIncome = this.dataFormat()[0].map(({ category, amount }) => ({ name: category, value: amount }))
        this.expendsesArr = this.dataFormat()[1].map(({ amount }) => amount)
        this.histogram()
        this.pie()
        console.log(this.pieIncome, 'im')
      })
    }, 2000);
  },
  methods: {

    dataFormat() {
      let amount = 0
      let sameArr = []
      let sumArr = []
      let expendSameArr = []
      let expendsumArr = []

      // 数组去重
      this.expendsesCategory = [...new Set(this.expenses.map(item => item.category))]
      this.incomeCategory = [...new Set(this.income.map(item => item.category))]

      // 数组中的对象category属性相同的amount值进行相加
      for (let i = 0; i < this.incomeCategory.length; i++) { 
        for (let y = 0; y < this.income.length; y++) {
          if(this.incomeCategory[i] === this.income[y].category) {
            amount += Number(this.income[y].amount.split('￥')[1].replace(/,/g, ''))
            sameArr.unshift({ category: this.incomeCategory[i], amount  })
          }
        }
        sumArr.push(sameArr[0])
      }

      for (let i = 0; i < this.expendsesCategory.length; i++) {
        for (let y = 0; y < this.expenses.length; y++) {
          if(this.expendsesCategory[i] === this.expenses[y].category) {
            amount += Number(this.expenses[y].amount.split('￥')[1].replace(/,/g, ''))
            expendSameArr.unshift({ category: this.expendsesCategory[i], amount  })
          }
        }
        expendsumArr.push(expendSameArr[0])
      }

      console.log(sumArr, 'sumArr', expendsumArr, 'expendsumArr')
      return [sumArr, expendSameArr]
    },

    // 柱状图
    histogram() {
      const month = moment(this.month ? this.month : new Date()).format('yyyy-MM')
      const myChart = this.$echarts.init(document.getElementById('line'));
      const option = {
          title: {
            text: `用户${ month }月份支出总额统计`
          },
          // tooltip: {
          //   trigger: 'item',
          //   formatter: '{a} <br/>{b} : {c}'
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            right: 'right',
            data:['支出总额']
          },
          xAxis: {
            name: '分类',
            type: 'category',
            boundaryGap: false,
            data: this.expendsesCategory,
          },
          yAxis: {
            name: '金额 / 元',
            type: 'value'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          series: [{
            name: '支出总额',
            type: 'line',
            areaStyle: {},
            data: this.expendsesArr.sort((a,b) => a-b)
          }]
      }
      myChart.setOption(option);
    },

    // 饼图
    pie() {
      const month = moment(this.month ? this.month : new Date()).format('yyyy-MM')
      const myChart = this.$echarts.init(document.getElementById('pie'));
      const option = {
        title: {
          text: `用户${ month }月份收入总额统计`,
          left: 'center'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.incomeCategory
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
          name: '收入总额',
          type: 'pie',
          radius: '55%',
          roseType: 'radius',
          label: {
            formatter: '{b}: {@2012} ({d}%)'
          },
          data: this.pieIncome.sort((a, b) => a.value - b.value)
        }]
      }
      myChart.setOption(option);
    }
  },
}
</script>

<style lang="less" scoped>
.statistics {
  width: 88vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .content {
    .canvans {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
    }
  }
  .title {
    margin-bottom: 50px;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
<style lang="less">
.statistics {
  .el-input__inner {
    background-color: #fafafa;
    color: #999;
    border-color: #eee;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>