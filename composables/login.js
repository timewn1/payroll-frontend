import { reactive, ref, useContext } from '@nuxtjs/composition-api'

function useLogin() {
  const { $auth } = useContext()
  const loading = ref(false)
  const success = ref(false)
  const isError = ref(false)
  const form = reactive({
    email: '',
    password: '',
  })

  const login = async (form) => {
    loading.value = true
    await $auth
      .loginWith('laravelSanctum', {
        data: form,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token)
          $auth.redirect('home')
          isError.value = false
          success.value = true
        }
      })
      .catch((error) => {
        console.log(error)
        success.value = false
        isError.value = true
      })
    loading.value = false
  }

  const logout = async () => {
    loading.value = true
    await $auth
      .logout()
      .then((response) => {
        $auth.redirect('logout')
      })
      .catch((error) => console.log(error))
    loading.value = false
  }

  return {
    loading,
    form,
    success,
    isError,
    login,
    logout,
  }
}

export { useLogin }
