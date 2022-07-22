<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600 text-capitalize">
              employees
            </h6>
          </div>
          <div class="card-body">
            <b-modal
              v-model="crudLoading"
              body-bg-variant="info"
              body-text-variant="light"
              hide-footer
              hide-header
              no-close-on-backdrop
              no-close-on-esc
            >
              <b-row class="justify-content-center">
                <b-spinner class="mt-1 mr-2" small></b-spinner>
                <span>Loading..</span>
              </b-row>
            </b-modal>
            <DataTable
              :count="data.length"
              :fields="fields"
              :filter="filter"
              :items="data"
              :loading="loading"
              show-filter="true"
              table="resigned-employees"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { useEmployee } from '~/composables/employee'

export default {
  name: 'ResignedEmployees',
  setup() {
    const items = ref([
      {
        text: 'employees',
        active: true,
      },
    ])
    const {
      data,
      resignedFields: fields,
      loading,
      crudLoading,
      getResigned,
    } = useEmployee()
    const dataArr = ref([])

    onMounted(async () => {
      await getResigned()
      dataArr.value = data.value
    })

    const filter = (val) => {
      data.value = dataArr.value
      data.value = data.value.filter(
        (da) => da.uname === val || da.employee_id === parseInt(val)
      )
      if (!val) data.value = dataArr.value
    }

    return {
      items,
      loading,
      crudLoading,
      fields,
      data,
      filter,
    }
  },
}
</script>

<style scoped></style>
