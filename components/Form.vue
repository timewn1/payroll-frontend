<template>
  <form>
    <div v-for="(field, index) in fields" :key="index" class="form-row mb-2">
      <label class="col-3 text-gray-700">{{ field.label }}:</label>
      <div class="col">
        <div v-if="field.type === 'select'">
          <b-form-select
            v-model="form[field.inp]"
            :class="
              field.error
                ? 'text-capitalize input-validation'
                : 'text-capitalize'
            "
            :options="field.options"
          ></b-form-select>
        </div>
        <div v-else-if="field.type === 'textarea'">
          <b-form-textarea
            v-model="form[field.inp]"
            :class="field.error ? 'text-capitalize input-validation' : ''"
            max-rows="6"
            placeholder="Enter address..."
            rows="3"
          ></b-form-textarea>
        </div>
        <div v-else>
          <input
            v-model="form[field.inp]"
            :class="
              field.error ? 'form-control input-validation' : 'form-control '
            "
            :type="field.type"
          />
        </div>
      </div>
    </div>
    <div class="mt-3">
      <button
        v-if="type === 'edit'"
        class="btn btn-sm btn-outline-success float-right"
        type="button"
        @click="onClick"
      >
        {{ loading ? 'Loading...' : 'Change' }}
      </button>
      <button
        v-if="type === 'add'"
        class="btn btn-sm btn-outline-info float-right"
        type="button"
        @click="onClick"
      >
        {{ loading ? 'Loading...' : 'Add' }}
      </button>
    </div>
  </form>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'

export default {
  name: 'Form',
  props: ['fields', 'type', 'submit', 'select', 'loading', 'data'],
  setup(props) {
    const form = ref([])
    const error = ref(false)

    onMounted(() => {
      props.fields.forEach((field) => {
        form.value[field.inp] = ''
      })

      if (Object.keys(props.data).length > 0) setData()
    })

    const validate = () => {
      error.value = false
      props.fields.forEach((field) => {
        if (form.value[field.inp] === '') {
          field.error = true
          error.value = true
        } else field.error = false
      })
    }

    const onClick = () => {
      validate()
      if (error.value) return
      props.submit(form.value)
    }

    const setData = () => {
      const formArr = []
      setTimeout(() => {
        Object.keys(props.data).forEach((d) => {
          formArr[d] = props.data[d]
        })
        form.value = formArr
      }, 1)
    }

    return {
      form,
      onClick,
    }
  },
}
</script>

<style scoped></style>
