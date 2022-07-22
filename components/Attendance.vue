<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>

      <div class="col-2 text-center">
        <input
          class="form-control form-control-sm"
          placeholder="Select the dates range"
          type="date"
          @change="dateFilter"
        />
        <span class="small text-gray-700">Search by day</span>
      </div>

      <div class="col-2 text-center">
        <input
          class="form-control form-control-sm"
          placeholder="Select the dates range"
          type="month"
          @change="monthFilter"
        />
        <span class="small text-gray-700">Search by month</span>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600 text-capitalize">
              Employee Attendances
            </h6>
          </div>
          <div class="card-body">
            <DataTable
              :count="count"
              :fields="fields"
              :filter="filter"
              :items="data"
              :loading="loading"
              :paginate="paginate"
              :table="'attendances'"
              show-filter="false"
              :status="status"
              :column-loading="columnLoading"
              :loading-row-id="loadingRowId"
            />
            <b-modal
              v-model="columnLoading"
              body-bg-variant="info"
              body-text-variant="light"
              hide-footer
              hide-header
              no-close-on-backdrop
              no-close-on-esc
            >
              <b-row class="justify-content-center">
                <b-spinner class="mt-1 mr-2" small></b-spinner>
                <span>Loading..</span>
              </b-row>
            </b-modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import moment from 'moment'
import { useAttendance } from '~/composables/attendance'

export default {
  name: 'Attendance',
  setup() {
    const { fields, loading, get, getAll, count, data, update, columnLoading } =
      useAttendance()
    const items = ref([
      {
        text: 'attendances',
        active: true,
      },
    ])
    const dataArr = ref([])
    const keyWord = ref('default')
    const date = ref('default')
    const month = ref('default')
    const loadingRowId = ref(0)

    onMounted(async () => {
      await get.all()
      dataArr.value = data.value
    })

    const paginate = async (page) => {
      await get.paginate(page, month.value, date.value)
    }

    const dateFilter = async (e) => {
      month.value = 'default'
      date.value = moment(e.target.value).format('DD-MMMM-YYYY')
      await get.date(date.value)
    }

    const monthFilter = async (e) => {
      date.value = 'default'
      month.value = moment(e.target.value).format('MMMM-YYYY')
      await get.month(month.value)
    }

    const filter = async (val) => {
      if (val === '') {
        await getAll()
        keyWord.value = 'default'
        return
      }
      data.value = ''
      count.value = 0
      keyWord.value = val
      await get.search(val)
    }

    const status = {
      async ignore(id, status) {
        if (status === 1) return
        loadingRowId.value = id
        await update.status('ignore', id)
        this.change(id, 1)
      },
      async npPay(id, status) {
        if (status === 2) return
        loadingRowId.value = id
        await update.status('noPay', id)
        this.change(id, 2)
      },
      async defaultSelection(id, status) {
        if (status === 0) return
        loadingRowId.value = id
        await update.status('default', id)
        this.change(id, 0)
      },

      change(id, status) {
        const index = data.value.findIndex((d) => d.id === id)
        if (index >= 0) data.value[index].is_ignored = status
      },
    }

    return {
      fields,
      loading,
      items,
      count,
      data,
      paginate,
      filter,
      dateFilter,
      monthFilter,
      status,
      columnLoading,
      loadingRowId,
    }
  },
}
</script>

<style scoped></style>
