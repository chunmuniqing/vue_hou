import axios from './serves'
function goLogin(data){
  return axios.post('/login',data)
}
export default {
  goLogin
}