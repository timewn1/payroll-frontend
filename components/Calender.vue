<template>
  <div>
    <div>
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>
        <input
          class="form-control form-control-sm col-2"
          placeholder="Select the dates range"
          type="month"
          @change="filter"
        />
        <nuxt-link
          to="/calendar/add"
          class="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm"
          ><i class="fas fa-plus fa-sm text-white-50"></i> Add
          Holiday</nuxt-link
        >
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="calendar">
          <div class="month">
            <i v-if="!loading" class="fas fa-angle-left prev" @click="prev"></i>
            <b-spinner small v-if="loading"></b-spinner>
            <div class="date">
              <h1>{{ monthTitle }} {{ yearTitle }}</h1>
            </div>
            <i
              v-if="!loading"
              class="fas fa-angle-right next"
              @click="next"
            ></i>
            <b-spinner small v-if="loading"></b-spinner>
          </div>
          <div class="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div class="days"></div>
        </div>
      </div>
      <div class="col-12 col-xl-4 col-lg-6">
        <DefaultLoading v-if="loading" />
        <CalendarStatus
          v-for="(d, i) in data"
          :key="i"
          :data="d"
          :delete-row="deleteRow"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import moment from 'moment'
import { useCalendar } from '~/composables/calendar'
import { removeItem } from '~/composables/usable'
import Helper from '~/composables/helper'

export default {
  name: 'Calender',
  setup() {
    const { loading, data, remove, get } = useCalendar()
    const date = ref(new Date())
    const { convert } = Helper()
    const monthTitle = ref('')
    const dayTitle = ref('')
    const yearTitle = ref(convert.Y(new Date()))
    const months = ref([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ])
    const approvedHolidays = ref([])
    const items = ref([
      {
        text: 'calender',
        active: true,
      },
    ])

    const renderCalender = () => {
      date.value.setDate(1)

      const monthDays = document.querySelector('.days')

      const lastDay = new Date(
        date.value.getFullYear(),
        date.value.getMonth() + 1,
        0
      ).getDate()

      const prevLastDay = new Date(
        date.value.getFullYear(),
        date.value.getMonth(),
        0
      ).getDate()

      const firstDayIndex = date.value.getDay()

      const lastDayIndex = new Date(
        date.value.getFullYear(),
        date.value.getMonth() + 1,
        0
      ).getDay()

      const nextDays = 7 - lastDayIndex - 1

      monthTitle.value = months.value[date.value.getMonth()]
      yearTitle.value = date.value.getFullYear()
      dayTitle.value = new Date().toDateString()

      let days = ''

      for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`
      }

      const isSet = (day) => {
        const index = approvedHolidays.value.indexOf(day.toString())
        if (index >= 0) return true
        return false
      }

      for (let i = 1; i <= lastDay; i++) {
        if (
          i === new Date().getDate() &&
          date.value.getMonth() === new Date().getMonth()
        ) {
          days += `<div class="today">${i}</div>`
        } else if (isSet(i)) {
          days += `<div class="approved-day">${i}</div>`
        } else {
          days += `<div>${i}</div>`
        }
      }

      for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`
        monthDays.innerHTML = days
      }
    }

    const setHolidays = () => {
      data.value.forEach((d) => {
        approvedHolidays.value.push(moment(d.date).format('D'))
      })
      renderCalender()
    }

    const filter = async (e) => {
      approvedHolidays.value = []
      data.value = []
      date.value = new Date(e.target.value)
      renderCalender()
      await get(moment(e.target.value).format('MMMM-yyyy'))
      if (data.value.length > 0) setHolidays()
    }

    const prev = async () => {
      approvedHolidays.value = []
      data.value = []
      date.value.setMonth(date.value.getMonth() - 1)
      renderCalender()
      await get(
        moment(new Date(date.value.setMonth(date.value.getMonth()))).format(
          'MMMM-yyyy'
        )
      )
      if (data.value.length > 0) setHolidays()
    }

    const next = async () => {
      approvedHolidays.value = []
      data.value = []
      date.value.setMonth(date.value.getMonth() + 1)
      renderCalender()
      await get(
        moment(new Date(date.value.setMonth(date.value.getMonth()))).format(
          'MMMM-yyyy'
        )
      )
      if (data.value.length > 0) setHolidays()
    }

    onMounted(async () => {
      renderCalender()
      await get(moment().format('MMMM-yyyy'))
      if (data.value.length > 0) setHolidays()
    })

    const deleteRow = (id) => {
      removeItem(data.value, id)
      approvedHolidays.value = []
      setHolidays()
      remove(id)
    }

    return {
      monthTitle,
      dayTitle,
      yearTitle,
      items,
      data,
      loading,
      deleteRow,
      prev,
      next,
      filter,
    }
  },
}
</script>

<style scoped></style>
