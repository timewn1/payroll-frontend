<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>
    </div>

    <div class="row justify-content-center">
      <div class="col-8">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600">Profile setting</h6>
          </div>
          <div class="card-body">
            <Form :fields="fields" type="edit" :submit="submit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

export default {
  name: 'Settings',
  setup() {
    const items = ref([
      {
        text: 'dashboard',
        to: '/dashboard',
      },
      {
        text: 'settings',
        active: true,
      },
    ])
    const disableEmail = ref(true)
    const fields = ref([
      {
        label: 'Name',
        inp: 'name',
        type: 'text',
      },
      {
        label: 'Email',
        inp: 'email',
        type: 'email',
      },
      {
        label: 'Current Password',
        inp: 'curr_password',
        type: 'password',
      },
      {
        label: 'New Password',
        inp: 'password',
        type: 'password',
      },
      {
        label: 'Re-type Password',
        inp: 're_password',
        type: 'password',
      },
    ])

    const submit = (form) => {
      console.log('no errors', form)
    }

    return {
      items,
      disableEmail,
      fields,
      submit,
    }
  },
}
</script>

<style scoped></style>
