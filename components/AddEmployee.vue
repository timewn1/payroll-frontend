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
              Add new employee
            </h6>
          </div>
          <div class="card-body">
            <Form
              :data="[]"
              :fields="fields"
              :loading="crudLoading"
              :submit="submit"
              type="add"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@nuxtjs/composition-api'
import { useEmployee } from '~/composables/employee'
import { setForm } from '~/composables/usable'

export default {
  name: 'AddEmployee',
  setup() {
    const { crudLoading, create, fields } = useEmployee()
    const items = ref([
      {
        text: 'employees',
        to: '/employees',
      },
      {
        text: 'add',
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
      emergency_contact: '',
      education: '',
      experience: '',
      skill: '',
      address: '',
      dob: '',
    })

    const submit = async (formArr) => {
      await create(setForm(form, formArr))
    }

    return {
      items,
      fields,
      crudLoading,
      submit,
    }
  },
}
</script>

<style scoped></style>
