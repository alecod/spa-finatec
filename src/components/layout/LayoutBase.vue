<template>
  <div class="w-100 d-flex justify-content-center">
    <button class="btn btn-lg btn-outline-primary w-75" @click="showModal = true">
      <i class="fa fa-plus" id="plus"></i>Novo Gasto
    </button>
    <form @submit.prevent="submit()">
      <div
        class="modal fade"
        :class="{show: showModal}"
        :style="{display: showModal ? 'block' : 'none'}"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLiveLabel">Modal title</h5>
              <button type="button" @click="closeModal()" class="close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form-group col-8">
                  <label for>Descrição:</label>
                  <input
                    type="text"
                    name
                    id
                    class="form-control"
                    required
                    v-model="form.description"
                  />
                </div>
                <div class="form-group col-4">
                  <label for>Valor (R$):</label>
                  <input type="text" name id class="form-control" required v-model="form.value" />
                </div>
                <div class="form-group col-12 d-flex align-items-center">
                  <input
                    type="file"
                    name
                    id
                    class="d-none"
                    accept="image/*"
                    ref="input"
                    @change="handleFile($event)"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="openFile()"
                  >Adicionar comprovante</button>
                  <div v-if="form.recibo" class="mt-2">
                    {{ form.recibo.name }}
                    <button
                      type="button"
                      class="btn badge badge-light"
                      @click="form.recibo = ''"
                    >
                      <i class="fa fa-trash text-danger"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal()">Fechar</button>
              <button class="btn btn-primary" :disabled="loading">
                <template v-if="loading">
                  <i class="fa fa-spin fa-spinner"></i>
                  incluindo...
                </template>
                <template v-else>
                Incluir novo gasto
                </template>
                </button>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div
      class="modal-backdrop fade"
      :class="{show: showModal}"
      :style="{display: showModal ? 'block' : 'none'}"
    ></div>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false,
    loading: false,
    form: {
      recibo: '',
      description: '',
      value: ''
    }
  }),
  computed: {
    fileName () {
      const { recibo } = this.form
      if (recibo) {
        const split = recibo.name.split('.')
        return `${split[0]}-${new Date().getTime()}.${split[1]}`
      } else {
        return ''
      }
    }
  },
  methods: {
    openFile () {
      this.$refs.input.value = null
      this.$refs.input.click()
    },
    handleFile ({ target }) {
      this.form.recibo = target.files[0]
    },
    async  submit () {
      let url = ''
      this.loading = true
      try {
        const ref = this.$firebase.database().ref(window.uid)
        const id = ref.push().key

        if (this.form.recibo) {
          const snapshot = await this.$firebase.storage()
            .ref(window.uid)
            .child(this.fileName)
            .put(this.form.recibo)
          url = await snapshot.ref.getDownloadURL()
        }
        const payLoad = {
          id,
          ...this.form,
          recibo: url,
          createdAt: new Date().getTime()
        }
        ref.child(id).set(payLoad, err => {
          if (err) {
            this.$root.$emit('Notification::show', {
              type: 'danger',
              message: 'Não foi possivel inserir o gasto, tente novamente...'
            })
          } else {
            this.$root.$emit('Notification::show', {
              type: 'success',
              message: 'Gasto inserido com sucesso!'
            })
            this.loading = false
          }
          this.closeModal()
          this.loading = false
        })
      } catch (err) {
        this.$root.$emit('Notification::show', {
          type: 'danger',
          message: 'Não foi possivel inserir o gasto, tente novamente...'
        })
      } finally {
        this.$root.$emit('Spinner::hide')
        this.loading = false
      }
    },
    closeModal () {
      this.showModal = false
    }
  }
}
</script>
<style lang="scss" scoped>
.modal {
  color: #111;
}
#plus{
      padding-right: 11px;
}
</style>
