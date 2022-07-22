<template>
  <div class="row">
    <div class="col-8">
      <b-card-body class="mb-2 shadow-sm" body-bg-variant="warning">
        <label class="badge text-dark">{{
          moment(data.date).format('ddd, DD')
        }}</label>
        <span class="font-italic small ml-5">{{ data.reason }}</span>
      </b-card-body>
    </div>
    <div>
      <button
        class="btn btn-sm btn-light shadow-sm"
        type="button"
        @click="deleteRow(data.id)"
      >
        <i class="fa fa-window-close text-danger"></i>
      </button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CalendarStatus',
  props: ['data', 'deleteRow'],
  setup() {
    return { moment }
  },
}
</script>

<style scoped></style>
