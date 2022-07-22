<template>
  <div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <b-breadcrumb :items="items" class="text-capitalize"></b-breadcrumb>
      <nuxt-link
        to="/employees/add"
        class="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm"
        ><i class="fas fa-plus fa-sm text-white-50"></i> Add</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

export default {
  name: 'ViewEmployee',
  setup() {
    const items = ref([
      {
        text: 'employees',
        to: '/employees',
      },
      {
        text: 'view',
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
