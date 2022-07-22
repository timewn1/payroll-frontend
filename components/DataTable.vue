<template>
  <div>
    <div class="row">
      <div class="col-8">
        <b-pagination
          v-model="currentPage"
          :per-page="perPage"
          :total-rows="count"
          aria-controls="my-table"
        ></b-pagination>
      </div>
      <div v-if="showFilter" class="col">
        <b-input-group size="sm">
          <b-form-input
            id="filter-input"
            v-model="filterThis"
            placeholder="Search"
            type="search"
          ></b-form-input>

          <b-input-group-append>
            <b-button :disabled="!filterThis" @click="filterThis = ''"
              >Clear
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <!--    default loading-->
    <DefaultLoading v-if="loading" />
    <!--    attendance table-->
    <b-table
      v-if="table === 'attendances' && !loading"
      :fields="fields"
      :items="items"
      borderless
      responsive
      striped
    >
      <template #cell(time_in)="data">
        <EditableColumn
          :id="data.item.id"
          :editedColumns="data.item.edited_columns"
          :title="data.item.time_in"
          columnName="time_in"
        />
      </template>
      <template #cell(time_in_lunch)="data">
        <EditableColumn
          :id="data.item.id"
          :editedColumns="data.item.edited_columns"
          :title="data.item.time_in_lunch"
          columnName="time_in_lunch"
        />
      </template>
      <template #cell(time_out_lunch)="data">
        <EditableColumn
          :id="data.item.id"
          :editedColumns="data.item.edited_columns"
          :is-edited="data.item.is_edited"
          :title="data.item.time_out_lunch"
          columnName="time_out_lunch"
        />
      </template>
      <template #cell(time_out)="data">
        <EditableColumn
          :id="data.item.id"
          :editedColumns="data.item.edited_columns"
          :title="data.item.time_out"
          columnName="time_out"
        />
      </template>
      <template #cell(dinner_time_in)="data">
        <EditableColumn
          :id="data.item.id"
          :editedColumns="data.item.edited_columns"
          :title="data.item.dinner_time_in"
          columnName="dinner_time_in"
        />
      </template>
      <template #cell(dinner_time_out)="data">
        <EditableColumn
          :id="data.item.id"
          :editedColumns="data.item.edited_columns"
          :title="data.item.dinner_time_out"
          columnName="dinner_time_out"
        />
      </template>
      <template #cell(ot_time_out)="data">
        <EditableColumn
          :id="data.item.id"
          :editedColumns="data.item.edited_columns"
          :title="data.item.ot_time_out"
          columnName="ot_time_out"
        />
      </template>
      <template #cell(basic_salary)="data"
        >{{ Number(data.item.basic_salary).toLocaleString() }}
      </template>
      <template #cell(date)="data">
        {{ convert.date(data.item.date) }}
      </template>
      <template #cell(status)="data">
        <span v-if="data.item.is_ignored === 1" class="badge badge-info"
          >Normal day</span
        >
        <span v-else-if="data.item.is_ignored === 2" class="badge badge-warning"
          >No pay</span
        >
      </template>
      <template #cell(action)="data">
        <b-dropdown size="sm" text="Select action">
          <b-dropdown-item
            @click="status.ignore(data.item.id, data.item.is_ignored)"
            >Ignore
          </b-dropdown-item>
          <b-dropdown-item
            @click="status.npPay(data.item.id, data.item.is_ignored)"
            >No pay
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item
            @click="status.defaultSelection(data.item.id, data.item.is_ignored)"
            >Default
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
    <!--    employee table-->
    <b-table
      v-if="table === 'employees' && !loading"
      :current-page="currentPage"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      borderless
      responsive
      striped
    >
      <template #cell(action)="data">
        <nuxt-link
          :to="`/employees/edit/${data.item.id}`"
          class="btn btn-sm btn-outline-success shadow-sm"
          ><i class="fas fa-pencil-alt fa-sm"></i>
        </nuxt-link>
        <button
          class="btn btn-sm btn-outline-danger shadow-sm"
          @click="deleteRow(data.item.id)"
        >
          <i class="fas fa-trash-alt fa-sm"></i>
        </button>
      </template>
    </b-table>
    <!--    resigned employee-->
    <b-table
      v-if="table === 'resigned-employees' && !loading"
      :current-page="currentPage"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      borderless
      responsive
      striped
    >
    </b-table>
    <!--    excel table-->
    <b-table
      v-if="table === 'excel' && !loading"
      :fields="fields"
      :items="items"
      borderless
      responsive
      striped
    >
      <template #cell(date)="data">
        {{ convert.date(data.item.date) }}
      </template>
      <template #cell(action)="data">
        <a
          :href="`http://localhost:8000/api/excel/download/${data.item.month_year}`"
          class="btn btn-sm btn-info shadow-sm"
          download
          type="button"
        >
          <i class="fas fa-download fa-sm text-white-50"></i>
          Download
        </a>
      </template>
    </b-table>
    <!--    salary table-->
    <b-table
      v-if="table === 'salaries' && !loading"
      :current-page="currentPage"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      borderless
      responsive
      striped
    >
      <template #cell(basic_salary)="data"
        >{{ salary(data.item.basic_salary, data.item.data) }}
      </template>
      <template #cell(action)="data">
        <button
          class="btn btn-sm btn-outline-info shadow-sm"
          @click="
            view(
              data.item.basic_salary,
              `/employees/salary/employee/${data.item.employee_id}`
            )
          "
        >
          <i class="fas fa-eye fa-sm"></i>
        </button>
      </template>
    </b-table>
    <!--    employee salary table-->
    <b-table
      v-if="table === 'employee-salary' && !loading"
      :current-page="currentPage"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      borderless
      responsive
      striped
    >
      <template #cell(date)="data">
        {{ convert.date(data.item.date) }}
      </template>
      <template #cell(day)="data">
        {{ convert.day(data.item.date) }}
      </template>
      <template #cell(working_hours)="data">
        {{
          convert.hoursMin(
            calculate.workingHours(
              data.item.time_in,
              convert.day(data.item.date) === 'Sat' ? '13:00:00' : '17:00:00',
              data.item.time_in_lunch,
              data.item.time_out_lunch,
              data.item.is_ignored,
              calculate.regular(convert.day(data.item.date))
            )
          )
        }}
      </template>
      <template #cell(regular)="data"
        >{{ calculate.regular(convert.day(data.item.date)) }}
      </template>
      <template #cell(ot)="data">
        {{
          convert.hoursMin(
            calculate.OT(
              convert.day(data.item.date) === 'Sat' ? '13:00:00' : '17:00:00',
              data.item.ot_time_out,
              calculate.duration(
                data.item.dinner_time_in,
                data.item.dinner_time_out
              ),
              calculate.earlyOut(
                calculate.regular(convert.day(data.item.date)),
                calculate.workingHours(
                  data.item.time_in,
                  convert.day(data.item.date) === 'Sat'
                    ? '13:00:00'
                    : '17:00:00',
                  data.item.time_in_lunch,
                  data.item.time_out_lunch,
                  data.item.is_ignored,
                  calculate.regular(convert.day(data.item.date))
                )
              ),
              data.item.is_ignored
            )
          )
        }}
      </template>
      <template #cell(early_out)="data">
        {{
          convert.hoursMin(
            calculate.earlyOut(
              calculate.regular(convert.day(data.item.date)),
              calculate.workingHours(
                data.item.time_in,
                convert.day(data.item.date) === 'Sat' ? '13:00:00' : '17:00:00',
                data.item.time_in_lunch,
                data.item.time_out_lunch,
                data.item.is_ignored,
                calculate.regular(convert.day(data.item.date))
              )
            )
          )
        }}
      </template>
      <template #cell(lunch)="data">
        {{
          convert.hoursMin(
            calculate.duration(
              data.item.time_in_lunch,
              data.item.time_out_lunch
            )
          )
        }}
      </template>
      <template #cell(dinner)="data">
        {{
          convert.hoursMin(
            calculate.duration(
              data.item.dinner_time_in,
              data.item.dinner_time_out
            )
          )
        }}
      </template>
      <template #cell(halfDay)="data">
        <label
          :class="
            calculate.isHalfDay(
              data.item.time_in,
              data.item.time_in_lunch,
              data.item.time_out_lunch,
              data.item.time_out
            )
              ? 'p-2 badge badge-warning'
              : ''
          "
        >
          {{
            calculate.isHalfDay(
              data.item.time_in,
              data.item.time_in_lunch,
              data.item.time_out_lunch,
              data.item.time_out
            )
              ? 'yes'
              : '-'
          }}
        </label>
      </template>
    </b-table>
    <!--    no data-->
    <div
      v-if="!loading && items.length === 0"
      class="row justify-content-center"
    >
      <span class="badge text-gray-400">No data</span>
    </div>
  </div>
</template>

<script>
import { ref, useRouter, watch } from '@nuxtjs/composition-api'
import { useSalary } from '~/composables/salary'
import Helper from '~/composables/helper'
import EditableColumn from '~/components/dashboard/EditableColumn'

export default {
  name: 'DataTable',
  components: { EditableColumn },
  props: [
    'items',
    'fields',
    'table',
    'deleteRow',
    'filter',
    'showFilter',
    'loading',
    'count',
    'paginate',
    'approvedHolidays',
    'year',
    'month',
    'status',
    'columnLoading',
    'loadingRowId',
  ],
  setup(props) {
    const currentPage = ref(1)
    const perPage = ref(10)
    const filterThis = ref('')
    const { calculate, regularTime } = useSalary()
    const { convert, commafy } = Helper()
    const router = useRouter()

    watch(filterThis, () => {
      props.filter(filterThis.value)
    })

    watch(currentPage, () => {
      if (
        props.table === 'employees' ||
        props.table === 'salaries' ||
        props.table === 'employee-salary'
      )
        return
      props.paginate(currentPage.value)
    })

    const isEmptyColumn = (title) => {
      if (title) return title
      return 'No data'
    }

    const view = (salary, path) => {
      localStorage.setItem('basicSalary', salary)
      router.push(path)
    }

    const salary = (bSalary, data) => {
      return commafy(
        calculate.netSalary(
          bSalary,
          data,
          props.approvedHolidays,
          props.month,
          props.year
        )
      )
    }

    return {
      currentPage,
      perPage,
      filterThis,
      calculate,
      isEmptyColumn,
      regularTime,
      convert,
      view,
      salary,
    }
  },
}
</script>

<style scoped></style>
