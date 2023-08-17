
const formatDate = (date) =>  `${date.getFullYear()}-${((date.getMonth() + 1) < 10 ? '0' : '') +( date.getMonth() + 1)  }-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`

module.exports = {
  formatDate
}