<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>
      <a
        href="#"
        class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        ><i class="fas fa-download fa-sm text-white-50"></i> Generate Report</a
      >
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
export default {
  name: 'Dashboard',
  setup() {
    const items = ref([
      {
        text: 'dashboard',
        active: true,
      },
    ])

    return {
      items,
    }
  },
}
</script>

<style scoped></style>
