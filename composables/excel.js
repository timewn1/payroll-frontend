import { ref, useContext } from '@nuxtjs/composition-api'
import { useToast } from 'vue-toastification/composition'

function useExcel() {
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
      label: 'Dinner Time in',
      key: 'dinner_time_in',
    },
    {
      label: 'Dinner Time out',
      key: 'dinner_time_out',
    },
    {
      label: 'Time Out',
      key: 'time_out',
    },
  ])
  const downloadFields = [
    {
      label: 'Date',
      key: 'month_year',
    },
    {
      label: 'Action',
      key: 'action',
    },
  ]
  const loading = ref(false)
  const crudLoading = ref(false)
  const { $axios } = useContext()
  const data = ref([])
  const count = ref(0)
  const toast = useToast()
  const success = ref(false)
  const isError = ref(false)

  const upload = async (form) => {
    crudLoading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .post(`${process.env.API_URL}/api/excel/upload`, form, config)
      .then((res) => {
        data.value = res.data.data
        count.value = res.data.total
        setResponse(true, res.data.msg)
      })
      .catch((error) => {
        console.log(error)
        setResponse(false, 'Something went wrong please try again later!')
      })
    crudLoading.value = false
  }

  const getAll = async () => {
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
  }

  const get = async (page) => {
    // ${process.env.API_URL}/api/excel/get-page/${page}/default/default
    loading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(
        `${process.env.API_URL}/api/excel/uploaded/get-page/${page}`,
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
  }

  const set = async (date = 'default') => {
    loading.value = true
    count.value = 0
    data.value = []
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(`${process.env.API_URL}/api/excel/set/${date}`, '', config)
      .then((res) => {
        data.value = res.data.data
        console.log(data.value)
        count.value = res.data.total
      })
      .catch((error) => {
        console.log(error)
      })
    loading.value = false
  }

  const perPage = async (page) => {
    loading.value = true
    data.value = []
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(`${process.env.API_URL}/api/excel/download/get/${page}`, '', config)
      .then((res) => {
        data.value = res.data.data.data
      })
      .catch((error) => {
        console.log(error)
      })
    loading.value = false
  }

  const setResponse = (resp, msg) => {
    loading.value = false
    crudLoading.value = false
    if (resp) {
      success.value = true
      isError.value = false
      toast.success(msg)
    } else {
      success.value = false
      isError.value = true
      toast.error(msg)
    }
  }

  return {
    fields,
    downloadFields,
    loading,
    crudLoading,
    data,
    count,
    upload,
    getAll,
    get,
    set,
    perPage,
  }
}

export { useExcel }
