<template>
  <div>
    <div class="row">
      <div class="col text-center">
        <h6 class="m-0 font-weight-bold text-gray-600">{{ date }}</h6>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col">
        <h6 class="m-0 font-weight-bold text-gray-700">
          Working hours: {{ convert.HM(totalWorkingHours) }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-gray-700">
          OT hours: {{ convert.hoursMin(totalOtHours) }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-gray-700">
          DOT hours: {{ convert.hoursMin(dotHours) }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-gray-700">
          Lunch duration hours: {{ convert.hoursMin(lunchDuration) }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-gray-700">
          Early out hours: {{ convert.hoursMin(earlyOutHours) }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-gray-700 float-right">
          Dinner duration hours: {{ convert.hoursMin(dinnerDuration) }}
        </h6>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col">
        <h6 class="m-0 font-weight-bold text-gray-700">
          B.Salary: {{ commafy(basicSalary) }}
        </h6>
      </div>
      <!--      <div class="col">-->
      <!--        <h6 class="m-0 font-weight-bold text-info">-->
      <!--          OT hours: {{ convert.hoursMin(totalOtHours + dotHours) }}-->
      <!--        </h6>-->
      <!--      </div>-->
      <div class="col">
        <h6 class="m-0 font-weight-bold text-info">
          Total OT amount:
          {{
            commafy(
              calculate.OTAmount(convert.mins(totalOtHours), basicSalary) +
                calculate.DOTAmount(convert.mins(dotHours), basicSalary)
            )
          }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-danger">
          No pay days: {{ noPayDays }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-danger">
          Total no pay amount:
          {{ commafy(calculate.NoPayAmount(basicSalary, noPayDays)) }}
        </h6>
      </div>
      <div class="col">
        <h6 class="m-0 font-weight-bold text-success float-right">
          Salary: {{ commafy(salary) }}
        </h6>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '~/composables/helper'
import { useSalary } from '~/composables/salary'

export default {
  name: 'MonthlySalary',
  props: [
    'otHours',
    'basicSalary',
    'dotHours',
    'noPayDays',
    'totalOtHours',
    'salary',
    'date',
    'dinnerDuration',
    'lunchDuration',
    'earlyOutHours',
    'totalWorkingHours',
  ],
  setup() {
    const { convert, commafy } = Helper()
    const { calculate } = useSalary()

    return { convert, calculate, commafy }
  },
}
</script>

<style scoped></style>
