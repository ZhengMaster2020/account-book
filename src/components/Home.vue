<template>
  <div class="home">
    
    <div class="filter-wrap">
     <div class="filter">
        <el-select
        clearable
        class="selector"
        v-model="type"
        placeholder="请选择类型">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        clearable
        class="selector"
        v-model="category"
        placeholder="请选择分类">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="month"
        type="month"
        placeholder="选择月份">
      </el-date-picker>
      <el-button
        plain
        type="info"
        icon="el-icon-search"
        class="search-btn"
        @click="handleSearchClick">
        搜索
      </el-button>
     </div>
      <div>
        <el-button
          plain
          type="success"
          icon="el-icon-edit"
          @click="showAddBill = true">
          新增账单
        </el-button>
      </div>
    </div>

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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            round
            type="success"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            plain
            round
            size="mini"
            type="info"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <p v-if="searchFlag">搜索无结果</p>
        <p v-else>暂无数据</p>
    </div>
    </el-table>

  <el-dialog title="新增账单" :visible.sync="showAddBill">
    <el-form
      ref="billFormDOM"
      label-position="left"
      label-width="50px"
      :rules="rules" 
      :model="billForm">
      <el-form-item label="时间" prop="time">
        <el-date-picker
          align="center"
          type="datetime"
          placeholder="选择日期"
          v-model="billForm.time"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="billForm.type" clearable placeholder="请选择类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select clearable v-model="billForm.category" placeholder="请选择账单分类">
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input
          clearable
          class="amount" 
          placeholder="请输入金额"
          v-model="billForm.amount"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button round type="success" @click="handleSubmitFormCilck('billFormDOM')">确 定</el-button>
      <!-- <el-button round plain type="info" @click="handleResetFormClick('billFormDOM')">重置</el-button> -->
      <el-button round plain type="info" @click="billForm = {}">重置</el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import { mapMutations } from 'vuex'
import { numberWithCommas } from '@/utils'

export default {
  name: 'Home',
  data() {
    
    const validateAmount = (rules, value, callback) => {
        if (!value) return callback(new Error('金额不能为空'))
        setTimeout(() => {
          console.log(isNaN(value), typeof(value) ,'value')
          isNaN(value) && callback(new Error('请输入数字值'))
          
        }, 300);
      }

    return {
      month: '',
      type: '',
      category: '',
      categoryOptions: [],
      typeOptions: [
        { label: '支出', value: '支出' },
        { label: '收入', value: '收入' }
      ],
      scrollTop: 0,
      currentIndex: 0,
      searchFlag: false,
      isFinish: false,
      isMore: false,
      loading: false,
      showAddBill: false,
      initData: [],
      summaryData: [],
      accountData: [],
      billData: [],
      categories: [],
      billForm: {
        type: '',
        time: '',
        category: '',
        amount: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      rules: {
        amount: [{ validator: validateAmount, trigger: 'blur'}]
      }
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
    ...mapMutations({
      SET_Categories: 'setCategoryies',
      SET_Income: 'setIncome',
      SET_Expenses: 'setExpenses',
    }),

    handleSearchClick() {
      this.loading = true
      this.accountData = this.initData.filter(item => {
        const month = `${moment(item.time).year()}-${moment(item.time).month()}`
        const searchMonth = this.month ? `${moment(this.month).year()}-${moment(this.month).month()}` : ''
        const typeFlag =  item.type === this.type
        const categoryFlag = item.category === this.category
        const monthFlag = month === searchMonth
        const flag = // 三个搜索条件，七种搜索类型

          (typeFlag && !this.category && !this.month) ||  // 1.只选择类型搜索
          (categoryFlag && !this.type && !this.month) || // 2.只选择分类搜索
          (monthFlag && !this.type && !this.category) || // 3.只选择月份搜索
          (typeFlag && categoryFlag && !this.month) || // 4.选择类型和分类搜索
          (typeFlag && monthFlag && !this.category) || // 5.选择类型和月份进行搜索
          (categoryFlag && monthFlag && !this.type) ||  // 6.选择分类和月份进行搜索
          (typeFlag && categoryFlag && monthFlag) // 7.选择类型、分类、月份进行搜索

        return flag
      })
      setTimeout(() => {
        this.loading = false
      }, 300)
      this.accountData.length ? this.searchFlag = false : this.searchFlag = true
      console.log(this.accountData, 'opop')
    },

    handleSubmitFormCilck(formName) {
      this.$refs[formName].validate(vaild => {
        // 通过验证 --> 调用接口保存数据
        if (vaild) {
          // this.$http.post()
          console.log(vaild)
        } else {
          this.$message.error('error submit')
          return false
        }
      })
    },

    // handleResetFormClick(formName) {
    //   this.$refs[formName].resetFields()
    // },

    async fetchData() {
      this.loading = true
      const bill = await this.$http.get('/api/file/bill')
      const categories = await this.$http.get('/api/file/categories')
      this.SET_Categories(categories.data)
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
      let data
      if (this.currentIndex > this.initData.length -1) return this.isFinish = true
      this.loading = true
      this.type || this.category || this.month ? data =  this.accountData : data = this.initData
      data.slice(this.currentIndex, this.currentIndex+12).forEach(item => this.accountData.push(item))
      this.currentIndex += 12
      setTimeout(() => {
        this.loading = false
      }, 300);
    }, 

    // 数据格式转换
    dataFormat(bill, category) {
      const income = []
      const expenses = []
      category.forEach(ele =>  this.categoryOptions.push({ label: ele.name, value: ele.name }))

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

      this.initData.forEach(item => {
        item.type === '收入' && 
        income.push({ time: item.time, amount: item.amount, category: item.category })
        item.type === '支出' && 
        expenses.push({ time: item.time, amount: item.amount, category: item.category })
      })
      // console.log(income, 'ooopop')
      this.SET_Income(income)
      this.SET_Expenses(expenses)
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
  align-items: left;
  justify-content: center;
  background-color: #fff;
  width: 80vw;
  padding: 20px;
  min-height: 60vh;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 66px;
  margin-bottom: 50px;
  .table {
    width: 95%;
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
  .filter-wrap {
    width: 76vw;
    display: flex;
    justify-content: space-between;
  }
  .filter {
    display: flex;
    text-align: left;
    justify-content: left;
    margin-bottom: 20px;
    .search-btn {
      margin-left: 20px;
    }
    .selector {
      margin-right: 20px;
    }
  }
  .nodata {
    margin-top: 50px;
  }
  .nomore {
    margin: 20px;
    color: #999;
  }
  .amount {
    width: 220px;
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
  .el-dialog__body {
    text-align: left;
    margin-left: 120px;
  }
}
</style>