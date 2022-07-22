import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { useToast } from 'vue-toastification/composition'

function useEmployee() {
  const loading = ref(false)
  const crudLoading = ref(false)
  const { $axios } = useContext()
  const success = ref(false)
  const isError = ref(false)
  const errors = ref([])
  const toast = useToast()
  const router = useRouter()
  const data = ref([])
  const tableFields = ref([
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
      label: 'Age',
      key: 'age',
    },
    {
      label: 'User Role',
      key: 'user_role',
    },
    {
      label: 'DOB',
      key: 'dob',
    },
    {
      label: 'B.Salary',
      key: 'basic_salary',
    },
    {
      label: 'Phone',
      key: 'phone',
    },
    {
      label: 'Emergency Contact',
      key: 'emergency_contact',
    },
    {
      label: 'Education',
      key: 'education',
    },
    {
      label: 'Experience',
      key: 'experience',
    },
    {
      label: 'Skills',
      key: 'skill',
    },
    {
      label: 'Address',
      key: 'address',
    },
    {
      label: 'Action',
      key: 'action',
    },
  ])
  const resignedFields = ref([
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
      label: 'Age',
      key: 'age',
    },
    {
      label: 'User Role',
      key: 'user_role',
    },
    {
      label: 'DOB',
      key: 'dob',
    },
    {
      label: 'B.Salary',
      key: 'basic_salary',
    },
    {
      label: 'Phone',
      key: 'phone',
    },
    {
      label: 'Emergency Contact',
      key: 'emergency_contact',
    },
    {
      label: 'Education',
      key: 'education',
    },
    {
      label: 'Experience',
      key: 'experience',
    },
    {
      label: 'Skills',
      key: 'skill',
    },
    {
      label: 'Address',
      key: 'address',
    },
  ])
  const fields = ref([
    {
      label: 'Employee ID',
      inp: 'employee_id',
      type: 'text',
      error: false,
    },
    {
      label: 'User Name',
      inp: 'uname',
      type: 'text',
      error: false,
    },
    {
      label: 'Nic',
      inp: 'nic',
      type: 'text',
      error: false,
    },
    {
      label: 'Email',
      inp: 'email',
      type: 'email',
      error: false,
    },
    {
      label: 'First Name',
      inp: 'fname',
      type: 'text',
      error: false,
    },
    {
      label: 'Last Name',
      inp: 'lname',
      type: 'text',
      error: false,
    },
    {
      label: 'Middle Name',
      inp: 'mname',
      type: 'text',
      error: false,
    },
    {
      label: 'Age',
      inp: 'age',
      type: 'text',
      error: false,
    },
    {
      label: 'User Role',
      inp: 'user_role',
      type: 'select',
      options: [
        'accountant',
        'manager',
        'tech guy',
        'sales man',
        'receptionist',
      ],
      error: false,
    },
    {
      label: 'Phone',
      inp: 'phone',
      type: 'text',
      error: false,
    },
    {
      label: 'Emergency Contact',
      inp: 'emergency_contact',
      type: 'text',
      error: false,
    },
    {
      label: 'Education',
      inp: 'education',
      type: 'text',
      error: false,
    },
    {
      label: 'Experience',
      inp: 'experience',
      type: 'text',
      error: false,
    },
    {
      label: 'Skills',
      inp: 'skill',
      type: 'text',
      error: false,
    },
    {
      label: 'Address',
      inp: 'address',
      type: 'textarea',
      textarea: true,
      error: false,
    },
    {
      label: 'DOB',
      inp: 'dob',
      type: 'date',
      error: false,
    },
    {
      label: 'Basic Salary',
      inp: 'basic_salary',
      type: 'text',
      error: false,
    },
  ])

  const create = async (form) => {
    crudLoading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .post(`${process.env.API_URL}/api/employee/create`, form, config)
      .then((res) => {
        setResponse(true, res.data.msg)
        router.push('/employees')
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        showServerSideValidation()
      })
    crudLoading.value = false
  }

  const update = async (form) => {
    crudLoading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .post(`${process.env.API_URL}/api/employee/update`, form, config)
      .then((res) => {
        setResponse(true, res.data.msg)
        router.push('/employees')
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
      .get(`${process.env.API_URL}/api/employee/all/default`, '', config)
      .then((res) => {
        data.value = res.data.data
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
      })
    loading.value = false
  }

  const getResigned = async () => {
    loading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(`${process.env.API_URL}/api/employee/all/resigned`, '', config)
      .then((res) => {
        data.value = res.data.data
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
      })
    loading.value = false
  }

  const get = async (id) => {
    loading.value = true
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
    await $axios
      .get(`${process.env.API_URL}/api/employee/get/${id}`, '', config)
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
    await $axios
      .post(`${process.env.API_URL}/api/employee/delete`, { id }, config)
      .then((res) => {
        setResponse(true, res.data.msg)
      })
      .catch((error) => {
        errors.value = error.response.data.errors
        setResponse(false, 'Something went wrong!')
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

  const showServerSideValidation = () => {
    crudLoading.value = false
    Object.keys(errors.value).forEach((key, i) => {
      setTimeout(() => {
        toast.error(errors.value[key][0])
      }, i * 100)
    })
  }

  return {
    loading,
    crudLoading,
    isError,
    success,
    errors,
    data,
    fields,
    tableFields,
    resignedFields,
    create,
    update,
    getAll,
    get,
    getResigned,
    remove,
  }
}

export { useEmployee }
