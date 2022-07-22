import moment from 'moment'

const Helper = () => {
  const convert = {
    day(date) {
      return moment(date).format('ddd')
    },

    date(date) {
      return moment(date).format('DD-MMM-YYYY')
    },

    YMD(date) {
      return moment(date).format('YYYY-MM-DD')
    },

    YDM(date) {
      return moment(date).format('YYYY-DD-MM')
    },

    M(date) {
      return moment(date).format('M')
    },

    Y(date) {
      return moment(date).format('YYYY')
    },

    MY(date) {
      return moment(date).format('MMMM-YYYY')
    },

    hoursMin(msSeconds) {
      if (msSeconds === 0) return 0
      const diffHrs = Math.floor((msSeconds % 86400000) / 3600000) // hours
      const diffMins = Math.round(((msSeconds % 86400000) % 3600000) / 60000) // minutes
      return diffHrs + ':' + diffMins
    },

    HM(duration) {
      let seconds = Math.floor((duration / 1000) % 60)
      let minutes = Math.floor((duration / (1000 * 60)) % 60)
      let hours = Math.floor(duration / (1000 * 60 * 60))

      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      return hours + ':' + minutes + ':' + seconds
    },

    mins(msSeconds) {
      if (msSeconds === 0) return 0
      return Math.floor(msSeconds / 60000)
    },
  }

  const commafy = (digits) => {
    return Number(digits).toLocaleString()
  }

  return { convert, commafy }
}

export default Helper
