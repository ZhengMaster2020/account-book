import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    categories: [],
    income: [],
    expenses: [],
  },
  getters: {
    incomeStatistics: (state) => {
      return state.income
    }
  },
  actions: {},
  mutations: {
    setCategoryies(state, categories) {
      categories.forEach(item => state.categories.push(item.name))
    },
    setIncome(state, income) {
      state.income = income
    },
    setExpenses(state, expenses) {
      state.expenses = expenses
    }
  },

})