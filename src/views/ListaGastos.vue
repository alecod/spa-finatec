<template>
<div>
  <div class="months-nav">
    <div class="month-link" :key="i" v-for="(month, i) in gruopedMonths" :class="{active: month.month === activeMonth.month}" @click="setActiveMonth(month)">
      <div class="month-label">{{ month.month }}</div>
      <div class="value-label" v-money-format="month.total"/>
    </div>
  </div>
  <div class="container-group">
      <div class="container">
    <div v-if="activeMonth.data && !activeMonth.data.length">
      Voce não cadastrou nenhum gasto nesse mes
    </div>
    <template v-else>
       <lista-dispesa :key="index" v-for="(item, index) in activeMonth.data" :data="item"/>
    </template>
  </div>
  </div>
  </div>
</template>

<script>
import moment from 'moment'
import ListaDispesa from './ListaDispesa'
import groupBy from 'lodash.groupby'

export default {
  name: 'ListaGastos',
  components: {
    ListaDispesa
  },
  data: () => ({
    expenses: [],
    activeMonth: {}
  }),
  created () {
    this.getData()
  },
  mounted () {
    this.setActiveMonth()
  },
  computed: {
    gruopedMonths () {
      let gruopedMonths = []

      const addMes = () => {
        gruopedMonths.push({
          data: [],
          total: 0,
          month: moment().format('MM/YYYY')
        })
      }

      if (this.expenses.length) {
        const months = groupBy(this.expenses, i => {
          return moment(i.createdAt).format('MM/YYYY')
        })

        const sortedMonths = Object.keys(months).sort((a, b) => {
          if (moment(`${a} 01`, 'MM/YYYY HH').isBefore(moment(`${b} 01`, 'MM/YYYY HH'))) {
            return -1
          } else {
            return +1
          }
        })

        gruopedMonths = sortedMonths.map(month => ({
          month,
          data: months[month],
          total: months[month].map(i => +i.value).reduce((a, c) => a + c, 0)
        }))

        const lastMonth = moment(gruopedMonths[gruopedMonths.length - 1].month, 'MM/YYYY')
        if (!lastMonth.isSame(moment(), 'month')) {
          addMes()
        }
      } else {
        addMes()
      }

      return gruopedMonths
    }
  },
  methods: {
    getData () {
      const ref = this.$firebase.database().ref(`/${window.uid}`)

      ref.on('value', snapshot => {
        const values = snapshot.val()
        this.expenses = Object.keys(values).map(i => values[i])
      })
    },
    setActiveMonth (month = null) {
      this.activeMonth = month || this.gruopedMonths[this.gruopedMonths.length - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
.months-nav {
  display: flex;
  margin-left: 15px;
  width: 100%;
  background-color: orange;
  .month-link {
    padding: 15px;
    cursor: pointer;
     transition: .1s;
    &:hover {
      background-color: #333;
      color: #fff;
    }
    &.active {
      background-color: #333;
    }
  }
}
.container-group{
  width: calc(100% + 30px);
   height: calc(100vh - 70px);
  overflow: hidden auto;
  margin-left: -15px;
}

.container-group::-webkit-scrollbar-track {
box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
background-color:  #F90;
}
.container{
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 15px;
}
</style>
