<template>
  <div>
    <div>
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-8">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600 text-capitalize">
              Edit employee
            </h6>
          </div>
          <div class="card-body">
            <Form
              v-if="!loading"
              :data="data"
              :fields="fields"
              :loading="crudLoading"
              :submit="submit"
              type="edit"
            />
            <DefaultLoading v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, useRoute } from '@nuxtjs/composition-api'
import { useEmployee } from '~/composables/employee'
import { setForm } from '~/composables/usable'

export default {
  name: 'EditEmployee',
  setup() {
    const route = useRoute()
    const items = ref([
      {
        text: 'employees',
        to: '/employees',
      },
      {
        text: 'edit',
        active: true,
      },
    ])
    const form = reactive({
      employee_id: '',
      fname: '',
      lname: '',
      mname: '',
      age: '',
      user_role: '',
      phone: '',
      address: '',
      dob: '',
    })
    const { loading, crudLoading, get, data, update, fields } = useEmployee()

    onMounted(async () => {
      const id = route.value.params.slug
      await get(id)
    })

    const submit = async (formArr) => {
      await update(setForm(form, formArr))
    }

    return {
      items,
      fields,
      loading,
      crudLoading,
      data,
      submit,
    }
  },
}
</script>

<style scoped></style>
