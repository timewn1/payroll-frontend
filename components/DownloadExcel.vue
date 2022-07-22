<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>

      <!--      <div class="col-6">-->
      <input
        class="form-control form-control-sm col-2"
        placeholder="Select the dates range"
        type="month"
        @change="filter"
        v-model="date"
      />
      <button
        class="btn btn-sm btn-primary shadow-sm"
        :disabled="loading"
        type="button"
        @click="clear"
      >
        <i class="fas fa-eraser fa-sm text-white-50"></i>
        Clear
      </button>
      <!--      </div>-->
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600 text-capitalize">
              download Sheet
            </h6>
          </div>
          <div class="card-body">
            <DataTable
              :count="count"
              :fields="fields"
              :items="data"
              :loading="loading"
              :paginate="paginate"
              :show-filter="false"
              :table="'excel'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import moment from 'moment'
import { useExcel } from '~/composables/excel'

export default {
  name: 'Excel',
  setup() {
    const items = ref([
      {
        text: 'download',
        active: true,
      },
    ])
    const element = ref()
    const filterOptions = ref([
      { value: 'name', text: 'Name' },
      { value: 'user_id', text: 'User ID' },
      { value: 'enroll_id', text: 'Enroll ID' },
    ])
    const {
      loading,
      downloadFields: fields,
      data,
      count,
      perPage,
      set,
    } = useExcel()
    const date = ref()

    onMounted(async () => {
      await set()
    })

    const filter = async (e) => {
      await set(moment(e.target.value).format('MMMM-YYYY'))
    }

    const clear = async () => {
      if (!date.value) return
      date.value = ''
      await set()
    }

    const paginate = async (page) => {
      await perPage(page)
    }

    return {
      items,
      element,
      filterOptions,
      loading,
      fields,
      data,
      count,
      date,
      paginate,
      filter,
      clear,
    }
  },
}
</script>

<style scoped></style>
