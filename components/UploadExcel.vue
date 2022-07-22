<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>

      <input
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        type="file"
        @change="onChange"
      />

      <div>
        <button
          :disabled="disableUpload || crudLoading"
          class="btn btn-sm btn-success shadow-sm"
          type="button"
          @click="submit"
        >
          <i class="fas fa-upload fa-sm text-white-50"></i>
          {{ crudLoading ? 'Loading...' : 'Upload' }}
        </button>
        <a
          :class="
            data.length === 0
              ? 'btn btn-sm btn-info shadow-sm disabled'
              : 'btn btn-sm btn-info shadow-sm'
          "
          :href="`http://localhost:8000/api/excel/download/default`"
          download
          type="button"
        >
          <i class="fas fa-download fa-sm text-white-50"></i>
          Download
        </a>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-gray-600 text-capitalize">
              uploaded sheet
            </h6>
          </div>
          <div class="card-body">
            <DataTable
              :count="count"
              :fields="fields"
              :items="data"
              :loading="loading"
              :paginate="paginate"
              :show-filter="false"
              :table="'excel'"
            />
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useExcel } from '~/composables/excel'

export default {
  name: 'Excel',
  setup() {
    const { fields, crudLoading, upload, data, loading, count, get } =
      useExcel()
    const disableUpload = ref(true)
    const file = ref()
    const items = ref([
      {
        text: 'upload',
        active: true,
      },
    ])

    const onChange = (e) => {
      file.value = ''
      if (e.target.files[0]) {
        disableUpload.value = false
        file.value = e.target.files[0]
      } else disableUpload.value = true
    }

    const submit = async () => {
      const fd = new FormData()
      fd.append('file', file.value)
      await upload(fd)
    }

    const paginate = async (page) => {
      await get(page)
    }

    return {
      loading,
      items,
      data,
      fields,
      disableUpload,
      crudLoading,
      count,
      onChange,
      submit,
      paginate,
    }
  },
}
</script>

<style scoped></style>
