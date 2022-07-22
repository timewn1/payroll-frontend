<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>

      <div>
        <button
          :class="
            data.length === 0
              ? 'btn btn-sm btn-success shadow-sm disabled'
              : 'btn btn-sm btn-success shadow-sm'
          "
          type="button"
          @click="download"
        >
          <i class="fas fa-tasks fa-sm text-white-50"></i>
          {{ crudLoading ? 'Loading...' : 'Prepare Download' }}
        </button>
        <a
          :class="
            !downloadReady
              ? 'btn btn-sm btn-info shadow-sm disabled'
              : 'btn btn-sm btn-info shadow-sm'
          "
          :href="`http://localhost:8000/api/employee/salary/download/${
            data.length === 0 ? 'Employee' : data[0].name
          }}/${date}`"
          download
          type="button"
        >
          <i class="fas fa-download fa-sm text-white-50"></i>
          Download
        </a>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col">
        <div class="card shadow">
          <div class="card-header">
            <MonthlySalary
              :basic-salary="basicSalary"
              :date="date"
              :dinner-duration="dinnerDuration"
              :dot-hours="DOtHours"
              :early-out-hours="earlyOutHours"
              :lunch-duration="lunchDuration"
              :no-pay-days="noPayDays"
              :ot-hours="OtHours"
              :salary="salary"
              :total-ot-hours="
                calculate.totalOtHours(OtHours, earlyOutHours, dinnerDuration)
              "
              :total-working-hours="totalWorkingHours"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600 text-capitalize">
              {{ data.length === 0 ? 'Employee' : data[0].name }}
            </h6>
          </div>
          <div class="card-body">
            <DataTable
              :count="data.length"
              :fields="fields"
              :items="data"
              :loading="loading"
              :show-filter="false"
              :table="'employee-salary'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, useRoute } from '@nuxtjs/composition-api'
import { useSalary } from '~/composables/salary'
import Helper from '~/composables/helper'

export default {
  name: 'EmployeeSalary',
  setup() {
    const route = useRoute()
    const date = ref(localStorage.getItem('date'))
    const month = ref(localStorage.getItem('month'))
    const year = ref(localStorage.getItem('year'))
    const userId = ref()
    const {
      getEmployee,
      loading,
      data,
      salaryFields: fields,
      calculate,
      approvedHolidays,
      prepareDownload,
      crudLoading,
    } = useSalary()
    const items = ref([
      {
        text: 'salary',
        to: '/employees/salary',
      },
      {
        text: 'employee',
        active: true,
      },
    ])
    const { convert } = Helper()
    const dataArr = ref([])
    const OtHours = ref(0)
    const DOtHours = ref(0)
    const noPayDays = ref(0)
    const earlyOutHours = ref(0)
    const dinnerDuration = ref(0)
    const totalWorkingHours = ref(0)
    const lunchDuration = ref(0)
    const salary = ref(0)
    const basicSalary = ref(localStorage.getItem('basicSalary'))
    const downloadableData = ref([])
    const downloadReady = ref(false)

    onMounted(async () => {
      await filter()
    })

    const filter = async () => {
      OtHours.value = 0
      DOtHours.value = 0
      noPayDays.value = 0
      earlyOutHours.value = 0
      dinnerDuration.value = 0
      lunchDuration.value = 0
      totalWorkingHours.value = 0
      salary.value = 0

      userId.value = route.value.params.slug
      await getEmployee(userId.value, date.value)
      dataArr.value = data.value

      if (data.value.length > 0) {
        getDaysInMonth()
        getTotalOTHours()
        getTotalDOTHours()
        getTotalEarlyOutHours()
        getTotalSalary()
        getDinnerDuration()
        getLunchDuration()
        getTotalWorkingHours()
      }
    }

    const getDaysInMonth = () => {
      const result = calculate.setHolidays(data.value, month.value, year.value)
      data.value = result.dataArr
      noPayDays.value = result.noPayDays
    }

    const getTotalOTHours = () => {
      OtHours.value = calculate.OThours(dataArr.value)
    }

    const getTotalDOTHours = () => {
      DOtHours.value = calculate.DOThours(dataArr.value, approvedHolidays.value)
    }

    const getTotalEarlyOutHours = () => {
      earlyOutHours.value = calculate.earlyOutHours(dataArr.value)
    }

    const getDinnerDuration = () => {
      dinnerDuration.value = calculate.totalDinnerDuration(dataArr.value)
    }

    const getLunchDuration = () => {
      lunchDuration.value = calculate.totalLunchDuration(dataArr.value)
    }

    const getTotalWorkingHours = () => {
      totalWorkingHours.value = calculate.totalWorkingHours(dataArr.value)
    }

    const getTotalSalary = () => {
      salary.value = calculate.netSalary(
        basicSalary.value,
        dataArr.value,
        approvedHolidays.value,
        month.value,
        year.value
      )
    }

    const download = async () => {
      downloadableData.value = []
      downloadReady.value = false
      dataArr.value.forEach((d) => {
        const array = {
          date: convert.date(d.date),
          day: convert.day(d.date),
          dept: d.dept,
          employee_id: d.employee_id,
          name: d.name,
          time_in: d.time_in,
          lunch_time_in: d.time_in_lunch,
          lunch_time_out: d.time_out_lunch,
          time_out: d.time_out,
          dinner_time_in: d.dinner_time_in,
          dinner_time_out: d.dinner_time_out,
          ot_time_out: d.ot_time_out,
          working_hours: convert.hoursMin(
            calculate.workingHours(
              d.time_in,
              convert.day(d.date) === 'Sat' ? '13:00:00' : '17:00:00',
              d.time_in_lunch,
              d.time_out_lunch,
              d.is_ignored,
              calculate.regular(convert.day(d.date))
            )
          ),
          regular: calculate.regular(convert.day(d.date)),
          ot: convert.hoursMin(
            calculate.OT(
              convert.day(d.date) === 'Sat' ? '13:00:00' : '17:00:00',
              d.dot_time_out,
              calculate.duration(d.dinner_time_in, d.dinner_time_out),
              calculate.earlyOut(
                calculate.regular(convert.day(d.date)),
                calculate.workingHours(
                  d.time_in,
                  convert.day(d.date) === 'Sat' ? '13:00:00' : '17:00:00',
                  d.time_in_lunch,
                  d.time_out_lunch,
                  d.is_ignored,
                  calculate.regular(convert.day(d.date))
                )
              ),
              d.is_ignored
            )
          ),
          early_out: convert.hoursMin(
            calculate.earlyOut(
              calculate.regular(convert.day(d.date)),
              calculate.workingHours(
                d.time_in,
                convert.day(d.date) === 'Sat' ? '13:00:00' : '17:00:00',
                d.time_in_lunch,
                d.time_out_lunch,
                d.is_ignored,
                calculate.regular(convert.day(d.date))
              )
            )
          ),
          lunch_duration: convert.hoursMin(
            calculate.duration(d.time_in_lunch, d.time_out_lunch)
          ),
          dinner_duration: convert.hoursMin(
            calculate.duration(d.dinner_time_in, d.dinner_time_out)
          ),
          half_day: calculate.isHalfDay(
            d.time_in,
            d.time_in_lunch,
            d.time_out_lunch,
            d.time_out
          )
            ? 'yes'
            : '',
        }
        downloadableData.value.push(array)
      })
      await prepareDownload(downloadableData.value)
      downloadReady.value = true
    }

    return {
      items,
      data,
      loading,
      fields,
      date,
      userId,
      OtHours,
      DOtHours,
      noPayDays,
      earlyOutHours,
      basicSalary,
      calculate,
      salary,
      dinnerDuration,
      lunchDuration,
      totalWorkingHours,
      download,
      downloadReady,
      crudLoading,
    }
  },
}
</script>

<style scoped></style>
