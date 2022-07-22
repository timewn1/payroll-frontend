<template>
  <div>
    <div class='d-sm-flex align-items-center justify-content-between mb-4'>
      <b-breadcrumb :items='items' class='text-capitalize'></b-breadcrumb>
      <nuxt-link
        class='d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm'
        to='/employees/add'
      ><i class='fas fa-plus fa-sm text-white-50'></i> Add
      </nuxt-link
      >
    </div>

    <div class='row'>
      <div class='col'>
        <div class='card shadow'>
          <div class='card-header py-3'>
            <h6 class='m-0 font-weight-bold text-gray-600 text-capitalize'>
              employees
            </h6>
          </div>
          <div class='card-body'>
            <b-modal
              v-model='crudLoading'
              body-bg-variant='info'
              body-text-variant='light'
              hide-footer
              hide-header
              no-close-on-backdrop
              no-close-on-esc
            >
              <b-row class='justify-content-center'>
                <b-spinner class='mt-1 mr-2' small></b-spinner>
                <span>Loading..</span>
              </b-row>
            </b-modal>
            <DataTable
              :count='data.length'
              :delete-row='deleteRow'
              :fields='fields'
              :filter='filter'
              :items='data'
              :loading='loading'
              show-filter='true'
              table='employees'
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import Swal from 'sweetalert2'
import { useEmployee } from '~/composables/employee'
import { removeItem } from '~/composables/usable'

export default {
  name: 'Employees',
  setup() {
    const items = ref([
      {
        text: 'employees',
        active: true
      }
    ])
    const {
      data,
      tableFields: fields,
      loading,
      crudLoading,
      getAll,
      remove,
      success
    } = useEmployee()
    const dataArr = ref([])

    onMounted(async () => {
      await getAll()
      dataArr.value = data.value
    })

    const deleteRow = (id) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await remove(id)
          if (success.value) {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
            removeItem(data.value, id)
          }
        }
      })
    }

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
      deleteRow,
      filter
    }
  }
}
</script>

<style scoped></style>
