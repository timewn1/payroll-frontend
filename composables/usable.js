const removeItem = (items, item) => {
  const index = items.findIndex((i) => i.id === item)
  if (index >= 0) items.splice(index, 1)
}

const setForm = (form, formArr) => {
  Object.keys(formArr).forEach((f) => {
    form[f] = formArr[f]
  })
  return form
}

export { removeItem, setForm }
