import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { useToast } from 'vue-toastification/composition'

function useCalendar() {
  const { $axios } = useContext()
  const loading = ref(false)
  const fields = ref([
    {
      label: 'Date',
      inp: 'date',
      type: 'date',
      error: false,
    },
    {
      label: 'Reason',
      inp: 'reason',
      type: 'text',
      error: false,
    },
  ])
  const crudLoading = ref(false)
  const success = ref(false)
  const isError = ref(false)
  const errors = ref([])
  const toast = useToast()
  const router = useRouter()
  const data = ref([])

  const create = async (form) => {
    crudLoading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .post(`${process.env.API_URL}/api/calendar/create`, form, config)
      .then((res) => {
        setResponse(true, res.data.msg)
        router.push('/calendar')
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        showServerSideValidation()
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
      .get(`${process.env.API_URL}/api/calendar/all/default`, '', config)
      .then((res) => {
        data.value = res.data.data
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
      })
    loading.value = false
  }

  const get = async (date) => {
    loading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(`${process.env.API_URL}/api/calendar/all/${date}`, '', config)
      .then((res) => {
        data.value = res.data.data
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
      })
    loading.value = false
  }

  const remove = async (id) => {
    crudLoading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios.post(
      `${process.env.API_URL}/api/calendar/delete`,
      { id },
      config
    )
  }

  const showServerSideValidation = () => {
    crudLoading.value = false
    Object.keys(errors.value).forEach((key, i) => {
      setTimeout(() => {
        toast.error(errors.value[key][0])
      }, i * 100)
    })
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
    loading,
    data,
    crudLoading,
    fields,
    create,
    getAll,
    remove,
    get,
  }
}

export { useCalendar }
