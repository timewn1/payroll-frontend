import { ref, useContext } from '@nuxtjs/composition-api'
import moment from 'moment'
import Helper from '~/composables/helper'

function useSalary() {
  const loading = ref(false)
  const crudLoading = ref(false)
  const { $axios } = useContext()
  const data = ref([])
  const errors = ref([])
  const success = ref(false)
  const isError = ref(false)
  const fields = ref([
    {
      label: 'Employee ID',
      key: 'employee_id',
      sortable: true,
    },
    {
      label: 'User Name',
      key: 'uname',
    },
    {
      label: 'NIC',
      key: 'nic',
    },
    {
      label: 'Email',
      key: 'email',
    },
    {
      label: 'First Name',
      key: 'fname',
    },
    {
      label: 'Last Name',
      key: 'lname',
    },
    {
      label: 'User Role',
      key: 'user_role',
    },
    {
      label: 'Phone',
      key: 'phone',
    },
    {
      label: 'Address',
      key: 'address',
    },
    {
      label: 'M.Salary',
      key: 'basic_salary',
    },
    {
      label: 'Action',
      key: 'action',
    },
  ])
  const salaryFields = ref([
    {
      label: 'Date',
      key: 'date',
    },
    {
      label: 'Day',
      key: 'day',
    },
    {
      label: 'Dept',
      key: 'dept',
    },
    {
      label: 'Employee Id',
      key: 'employee_id',
    },
    {
      label: 'Name',
      key: 'name',
    },
    {
      label: 'Enroll Id',
      key: 'enroll_id',
    },
    {
      label: 'Time in',
      key: 'time_in',
    },
    {
      label: 'Lunch time in',
      key: 'time_in_lunch',
    },
    {
      label: 'Lunch time out',
      key: 'time_out_lunch',
    },
    {
      label: 'Time Out',
      key: 'time_out',
    },
    {
      label: 'Dinner time in',
      key: 'dinner_time_in',
    },
    {
      label: 'Dinner time out',
      key: 'dinner_time_out',
    },
    {
      label: 'OT time out',
      key: 'ot_time_out',
    },
    {
      label: 'OT',
      key: 'ot',
    },
    {
      label: 'Working Hours',
      key: 'working_hours',
    },
    {
      label: 'Regular',
      key: 'regular',
    },
    {
      label: 'Early Out',
      key: 'early_out',
    },
    {
      label: 'Lunch Duration',
      key: 'lunch',
    },
    {
      label: 'Dinner Duration',
      key: 'dinner',
    },
    {
      label: 'Is Half Day',
      key: 'halfDay',
    },
  ])
  const approvedHolidays = ref([])
  const weekDays = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  const { convert } = Helper()

  const getAll = async () => {
    loading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(`${process.env.API_URL}/api/employee/salary/all/default`, '', config)
      .then((res) => {
        data.value = res.data.data
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
      })
    loading.value = false
  }

  const getAllByDate = async (date) => {
    loading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(`${process.env.API_URL}/api/employee/salary/all/${date}`, '', config)
      .then((res) => {
        data.value = res.data.data
        approvedHolidays.value = res.data.approvedDates
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
      })
    loading.value = false
  }

  const setResponse = (resp, msg) => {
    loading.value = false
    crudLoading.value = false
    if (resp) {
      success.value = true
      isError.value = false
    } else {
      success.value = false
      isError.value = true
    }
  }

  const getEmployee = async (userId, date) => {
    loading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }

    await $axios
      .get(
        `${process.env.API_URL}/api/excel/employee/get/${userId}/${date}`,
        '',
        config
      )
      .then((res) => {
        data.value = res.data.data
        approvedHolidays.value = res.data.approvedDates
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
      })
    loading.value = false
  }

  const prepareDownload = async (data) => {
    crudLoading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .post(
        `${process.env.API_URL}/api/employee/salary/download`,
        { data },
        config
      )
      .catch((err) => console.log(err))

    crudLoading.value = false
  }

  const calculate = {
    regular(day) {
      if (day === 'Sat') return '5:00'
      else if (day === 'Sun') return '0:00'
      else return '8:30'
    },

    workingHours(
      timeIn,
      timeOut,
      lunchTimeIn = false,
      lunchTimeOut = false,
      normalDay,
      regular
    ) {
      if ((!timeIn || !timeOut) && !normalDay) return 0
      const normalDayDuration =
        Number(regular.split(':')[0]) * 3600000 +
        Number(regular.split(':')[1]) * 60000

      if (normalDay === 1) return normalDayDuration

      const t2 =
        Number(timeOut.split(':')[0]) * 3600000 +
        Number(timeOut.split(':')[1]) * 60000 +
        Number(timeOut.split(':')[2]) * 1000
      const t1 =
        Number(timeIn.split(':')[0]) * 3600000 +
        Number(timeIn.split(':')[1]) * 60000 +
        Number(timeIn.split(':')[2]) * 1000

      const diffMs = new Date(t2) - new Date(t1) // time2 - time1
      return lunchTimeIn && lunchTimeOut
        ? diffMs - calculate.duration(lunchTimeIn, lunchTimeOut)
        : diffMs
    },

    OT(offTime, leftTime, dinnerDuration, earlyOut, ignored) {
      if (!leftTime || ignored) return 0
      leftTime =
        Number(leftTime.split(':')[0]) * 3600000 +
        Number(leftTime.split(':')[1]) * 60000 +
        Number(leftTime.split(':')[2]) * 1000

      offTime =
        Number(offTime.split(':')[0]) * 3600000 +
        Number(offTime.split(':')[1]) * 60000 +
        Number(offTime.split(':')[2]) * 1000

      const diffMs = leftTime - offTime - dinnerDuration - earlyOut
      if (diffMs < 0) return 0
      return diffMs
    },

    OThours(data) {
      let hours = 0
      data.forEach((d) => {
        const index = approvedHolidays.value.findIndex(
          (h) => h.date === convert.YMD(d.date)
        )
        if (index < 0)
          hours += calculate.OT(
            convert.day(d.date) === 'Sat' ? '13:00:00' : '17:00:00',
            d.ot_time_out,
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
      })
      return hours
    },

    OTAmount(minutes, basicSalary) {
      const amountPerMinute = (basicSalary / 30 / 8 / 60) * 1.5
      return Math.round(amountPerMinute * minutes)
    },

    DOThours(data, approvedDays) {
      let hours = 0
      data.forEach((d) => {
        const index = approvedDays.findIndex(
          (h) => h.date === convert.YMD(d.date)
        )
        if (index >= 0) {
          hours += calculate.OT(
            calculate.regular(convert.day(d.date)),
            calculate.workingHours(
              d.time_in,
              d.time_out,
              false,
              false,
              d.is_ignored,
              calculate.regular(convert.day(d.date))
            ),
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
            )
          )
        }
      })
      return hours
    },

    DOTAmount(minutes, basicSalary) {
      const amountPerMinute = (basicSalary / 30 / 8 / 60) * 2
      return Math.round(amountPerMinute * minutes)
    },

    totalOtHours(OT, earlyOutHours, dinnerDuration) {
      return OT // - earlyOutHours - dinnerDuration
    },

    earlyOut(regular, workingHours) {
      if (!workingHours) return 0
      workingHours = convert.hoursMin(workingHours)
      const t2 =
        Number(workingHours.split(':')[0]) * 3600000 +
        Number(workingHours.split(':')[1]) * 60000
      const t1 =
        Number(regular.split(':')[0]) * 3600000 +
        Number(regular.split(':')[1]) * 60000

      const diffMs = (new Date(t2) - new Date(t1)) * -1
      if (diffMs < 0) return 0
      return diffMs
    },

    earlyOutHours(data) {
      let hours = 0
      data.forEach((d) => {
        hours += calculate.earlyOut(
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
      })
      return hours
    },

    totalDinnerDuration(data) {
      let hours = 0
      data.forEach((d) => {
        hours += calculate.duration(d.dinner_time_in, d.dinner_time_out)
      })
      return hours
    },

    totalLunchDuration(data) {
      let hours = 0
      data.forEach((d) => {
        hours += calculate.duration(d.time_in_lunch, d.time_out_lunch)
      })
      return hours
    },

    totalWorkingHours(data) {
      let hours = 0
      data.forEach((d) => {
        hours += calculate.workingHours(
          d.time_in,
          d.time_out,
          d.time_in_lunch,
          d.time_out_lunch,
          d.is_ignored,
          calculate.regular(convert.day(d.date))
        )
      })
      return hours
    },

    duration(timeIn, timeOut) {
      if (!timeIn || !timeOut) return 0

      const t2 =
        Number(timeOut.split(':')[0]) * 3600000 +
        Number(timeOut.split(':')[1]) * 60000 +
        Number(timeOut.split(':')[2]) * 1000
      const t1 =
        Number(timeIn.split(':')[0]) * 3600000 +
        Number(timeIn.split(':')[1]) * 60000 +
        Number(timeIn.split(':')[2]) * 1000

      const diffMs = new Date(t2) - new Date(t1)
      return diffMs
    },

    mealTimeDifference(time) {
      const different = 1800000 - time // 30 mins - time
      return different
    },

    setHolidays(data, month, year) {
      const date = new Date(year, parseInt(month) - 1, 1)
      const days = []
      const dataArr = []
      let noPayDays = 0
      while (date.getMonth() === parseInt(month) - 1) {
        days.push(new Date(date))
        date.setDate(date.getDate() + 1)
      }

      days.forEach((day) => {
        const d1 = convert.YDM(day)
        const index = data.findIndex((da) => convert.YDM(da.date) === d1)
        if (index < 0) {
          const arr = {
            date: convert.YMD(day),
            dept: calculate.changeDept(convert.YMD(day)),
            _rowVariant: calculate.checkHolidays(convert.YMD(day)),
          }
          dataArr.push(arr)

          if (calculate.checkHolidays(convert.YMD(day)) === 'no-pay')
            noPayDays += 1
        } else {
          dataArr.push(data[index])
        }
      })

      return { noPayDays, dataArr }
    },

    checkHolidays(date) {
      const index = approvedHolidays.value.findIndex((d) => d.date === date)
      if (index >= 0) return 'poya-day'
      else {
        const index = weekDays.value.indexOf(moment(date).format('ddd'))
        if (index < 0) return 'danger'
        else return 'no-pay'
      }
    },

    changeDept(date) {
      const index = approvedHolidays.value.findIndex((d) => d.date === date)
      if (index >= 0) return approvedHolidays.value[index].reason
      else {
        const index = weekDays.value.indexOf(moment(date).format('ddd'))
        if (index < 0) return ''
        else return 'No Pay'
      }
    },

    isHalfDay(timeIn, timeInLunch, timeOutLunch, timeOut) {
      if (timeIn && timeInLunch && !timeOutLunch && !timeOut) return true
      return false
    },

    NoPayAmount(basicSalary, days) {
      const perDayAmount = basicSalary / 30
      return Math.round(perDayAmount * days)
    },

    netSalary(bSalary, data, approvedHolidays, month, year) {
      const OThours = calculate.totalOtHours(
        calculate.OThours(data),
        calculate.earlyOutHours(data),
        calculate.totalDinnerDuration(data)
      )

      const ot = calculate.OTAmount(convert.mins(OThours), bSalary)

      const dot = calculate.DOTAmount(
        convert.mins(calculate.DOThours(data, approvedHolidays)),
        bSalary
      )

      const holidays = calculate.setHolidays(data, month, year)
      const OTamount = ot + dot
      const noPayAmount = calculate.NoPayAmount(bSalary, holidays.noPayDays)
      const netSalary = parseInt(bSalary) + OTamount - noPayAmount
      return Math.round(netSalary)
    },
  }

  return {
    loading,
    getAll,
    getAllByDate,
    getEmployee,
    prepareDownload,
    data,
    fields,
    salaryFields,
    calculate,
    approvedHolidays,
    crudLoading,
  }
}

export { useSalary }
