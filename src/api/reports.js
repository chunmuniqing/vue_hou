import axios from './serves'
function getReports(data){
  return axios.get(`/reports/type/1`)
}


export default {
  getReports
}