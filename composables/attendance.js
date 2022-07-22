import { ref, useContext } from '@nuxtjs/composition-api'

function useAttendance() {
  const fields = ref([
    {
      label: 'Date',
      key: 'date',
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
      label: 'Time In Lunch',
      key: 'time_in_lunch',
    },
    {
      label: 'Time Out Lunch',
      key: 'time_out_lunch',
    },
    {
      label: 'Time Out',
      key: 'time_out',
    },
    {
      label: 'Dinner Time in',
      key: 'dinner_time_in',
    },
    {
      label: 'Dinner Time Out',
      key: 'dinner_time_out',
    },
    {
      label: 'Ot time Out',
      key: 'ot_time_out',
    },
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'Action',
      key: 'action',
    },
  ])
  const loading = ref(false)
  const columnLoading = ref(false)
  const crudLoading = ref(false)
  const { $axios } = useContext()
  const data = ref([])
  const count = ref(0)
  const success = ref(false)
  const isError = ref(false)

  const get = {
    async all() {
      loading.value = true
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
      await $axios
        .get(`${process.env.API_URL}/api/excel/all`, '', config)
        .then((res) => {
          data.value = res.data.data
          count.value = res.data.total
        })
        .catch((error) => {
          console.log(error)
        })
      loading.value = false
    },

    async paginate(page, month = 'default', date = 'default') {
      loading.value = true
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
      await $axios
        .get(
          `${process.env.API_URL}/api/excel/get-page/${page}/${month}/${date}`,
          '',
          config
        )
        .then((res) => {
          data.value = res.data.data.data
        })
        .catch((error) => {
          console.log(error)
        })
      loading.value = false
    },

    async date(date) {
      loading.value = true
      count.value = 0
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
      await $axios
        .get(`${process.env.API_URL}/api/excel/date/${date}`, '', config)
        .then((res) => {
          data.value = res.data.data
          count.value = res.data.total
        })
        .catch((error) => {
          console.log(error)
        })
      loading.value = false
    },

    async month(month) {
      loading.value = true
      count.value = 0
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
      await $axios
        .get(`${process.env.API_URL}/api/excel/month/${month}`, '', config)
        .then((res) => {
          data.value = res.data.data
          count.value = res.data.total
        })
        .catch((error) => {
          console.log(error)
        })
      loading.value = false
    },

    async search(word) {
      loading.value = true
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
      await $axios
        .get(`${process.env.API_URL}/api/excel/search/${word}`, '', config)
        .then((res) => {
          data.value = res.data.data
          count.value = res.data.total
        })
        .catch((error) => {
          console.log(error)
        })
      loading.value = false
    },
  }

  const update = {
    async column(id, name, value) {
      loading.value = true
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
      await $axios
        .post(
          `${process.env.API_URL}/api/excel/attendance/update/column`,
          { id, name, value },
          config
        )
        .then((res) => {
          data.value = res.data.data
          count.value = res.data.total
        })
        .catch((error) => {
          console.log(error)
        })
      loading.value = false
    },
    async status(status, id) {
      columnLoading.value = true
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
      await $axios
        .get(
          `${process.env.API_URL}/api/excel/attendance/update/${status}/${id}`,
          '',
          config
        )
        .catch((error) => {
          console.log(error)
        })
      columnLoading.value = false
    },
  }

  return {
    fields,
    loading,
    columnLoading,
    crudLoading,
    data,
    count,
    success,
    isError,
    get,
    update,
  }
}

export { useAttendance }
