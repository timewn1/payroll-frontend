<template>
  <div class="container">
    <!-- Outer Row -->
    <div class="row justify-content-center mt-5">
      <div class="col-6">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row">
              <div class="col-12">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Login</h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control form-control-user"
                        aria-describedby="emailHelp"
                        placeholder="Enter Email Address..."
                        v-model="form.email"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control form-control-user"
                        placeholder="Password"
                        v-model="form.password"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary btn-user btn-block"
                      @click="submit"
                      :disabled="loading"
                    >
                      {{ loading ? 'loading...' : 'Login' }}
                      <b-spinner v-if="loading" small></b-spinner>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, useContext } from '@nuxtjs/composition-api'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import Swal from 'sweetalert2'
import { useLogin } from '@/composables/login'
export default {
  name: 'Login',
  setup() {
    const { success, isError, loading, form, login } = useLogin()

    const { $auth } = useContext()

    const rules = computed(() => ({
      email: { email, required },
      password: { required },
    }))

    const loginBtn = ref('Login')

    const v$ = useVuelidate(rules, form)

    const submit = async () => {
      v$.value.$touch()

      if (v$.value.$error) {
        Swal.fire('Please enter valid credentials', '', 'warning')
        return
      }

      loginBtn.value = 'Loading'

      await login(form)

      if (success.value) {
        Swal.fire('Success!', '', 'success')
        $auth.redirect('/dashboard')
      }

      if (isError.value) {
        Swal.fire('Invalid Credentials!', '', 'error')
      }

      loginBtn.value = 'Login'
    }

    return {
      loading,
      loginBtn,
      form,
      v$,
      submit,
    }
  },
}
</script>

<style scoped></style>
