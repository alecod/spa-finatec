<template>
  <div class="expenses-list-item row">
    <div class="col-10">
      <div class="description">
      <div>{{ data.description }}</div>
      <button class="btn btn-sm btn-outline-primary" v-if="data.recibo" @click="openRecibo()">
       <i class="fa fa-paperclip"></i>
        Ver comprovante
      </button>
      </div>
      <small v-date-format="data.createdAt"></small>
    </div>
    <div class="col-2" v-money-format="data.value"/>
  </div>
</template>
<script>
export default {
  props: {
    data: { type: Object, required: true }
  },
  methods: {
    openRecibo () {
      window.open(this.data.recibo, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.expenses-list-item {
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
  padding-top: 15px;
  .description {
    display: flex;
    justify-content: space-between;
  }
}
</style>
