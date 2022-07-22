<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>

      <input
        class="form-control form-control-sm col-2"
        placeholder="Select the dates range"
        type="month"
        @change="dateFilter"
      />

      <div>
        <!--        <a-->
        <!--          :class="-->
        <!--            data.length === 0-->
        <!--              ? 'btn btn-sm btn-info shadow-sm disabled'-->
        <!--              : 'btn btn-sm btn-info shadow-sm'-->
        <!--          "-->
        <!--          :href="`http://localhost:8000/api/employee/download/${date}`"-->
        <!--          download-->
        <!--          type="button"-->
        <!--        >-->
        <!--          <i class="fas fa-download fa-sm text-white-50"></i>-->
        <!--          Download-->
        <!--        </a>-->
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600 text-capitalize">
              Employees Salaries
            </h6>
          </div>
          <div class="card-body">
            <DataTable
              :count="data.length"
              :fields="fields"
              :filter="filter"
              :items="data"
              :loading="loading"
              :table="'salaries'"
              :approved-holidays="approvedHolidays"
              :year="year"
              :month="month"
              show-filter="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useSalary } from '~/composables/salary'
import Helper from '~/composables/helper'

export default {
  name: 'Salary',
  setup() {
    const { data, loading, fields, getAllByDate, approvedHolidays } =
      useSalary()
    const date = ref('default')
    const { convert } = Helper()
    const month = ref('')
    const year = ref('')
    const items = ref([
      {
        text: 'employees',
        to: '/employees',
      },
      {
        text: 'salary',
        active: true,
      },
    ])
    const dataArr = ref([])

    // onMounted(async () => {
    //   await getAll()
    //   dataArr.value = data.value
    // })

    const filter = (val) => {
      data.value = dataArr.value
      data.value = data.value.filter(
        (da) => da.uname === val || da.employee_id === parseInt(val)
      )
      if (!val) data.value = dataArr.value
    }

    const dateFilter = async (e) => {
      date.value = convert.MY(e.target.value)
      year.value = convert.Y(e.target.value)
      month.value = convert.M(e.target.value)
      localStorage.setItem('date', date.value)
      localStorage.setItem('month', month.value)
      localStorage.setItem('year', year.value)
      await getAllByDate(date.value)
    }

    return {
      items,
      loading,
      data,
      fields,
      filter,
      dateFilter,
      date,
      approvedHolidays,
      year,
      month,
    }
  },
}
</script>

<style scoped></style>
