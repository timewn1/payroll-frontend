<template>
  <div>
    <span v-if="isEdited" class="badge text-info" @click="clickable">
      {{ time }}
    </span>
    <span
      v-if="edited(columnName) && !input && !isEdited"
      class="badge text-success"
      @click="clickable"
    >
      {{ time }}
    </span>
    <span
      v-else-if="
        time === 'No data' && !input && !edited(columnName) && !isEdited
      "
      class="badge text-danger editable-ele"
      @click="clickable"
    >
      {{ time }}
    </span>
    <input
      v-else-if="input"
      type="text"
      class="form-control small col-8"
      v-on:keyup.esc="inputCancel"
      v-on:keyup.enter="edit(id, columnName)"
      v-model="time"
    />
    <span class="badge text-gray-700" v-else-if="!isEdited" @click="clickable">
      {{ time }}
    </span>
    <b-modal
      v-model="loading"
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
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useAttendance } from '~/composables/attendance'

export default {
  name: 'EditableColumn',
  props: ['id', 'columnName', 'title', 'editedColumns', 'isEdited'],
  setup(props) {
    const input = ref(false)
    const time = ref(!props.title ? 'No data' : props.title)
    const prevTime = ref(!props.title ? 'No data' : props.title)
    const editedColumns = ref(props.editedColumns)
    const { update, loading } = useAttendance()
    const clickable = () => {
      input.value = true
      time.value = prevTime.value === 'No data' ? '' : prevTime.value
    }

    const inputCancel = () => {
      input.value = false
      time.value = prevTime.value
    }

    const edit = async (id, columnName) => {
      // if (!time.value)
      await update.column(id, columnName.trim(), time.value)
      input.value = false
      prevTime.value = time.value
      editedColumns.value = editedColumns.value + ',' + columnName
    }

    const edited = (column) => {
      if (!editedColumns.value) return
      const array = editedColumns.value.split(', ')
      if ((column, array[0].includes(column))) return true
      return false
    }

    return {
      clickable,
      input,
      inputCancel,
      edit,
      time,
      loading,
      edited,
    }
  },
}
</script>

<style scoped></style>
