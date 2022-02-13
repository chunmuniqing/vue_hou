import axios from './serves'
function goList(){
  return axios.get('/menus')
}
function getUser(data){
  return axios.get('/users',{params:data})
}
function getSwitchBtn(data){
  console.log(data);
  return axios.put(`/users/${data.uId}/state/${data.type}`)
}
function getAddUser(data){
  return axios.post('/users',data)
}
function getUserId(id){
  return axios.get(`/users/${id}`)
}
function getEditUser(data){
  return axios.put(`/users/${data.id}`,data)
}
function getDelUser(data){
  return axios.delete(`/users/${data.id}`)
}
function getAssignRoles(id,data){
  return axios.put(`users/${id}/role`,{rid:data})
}
export default {
  goList,
  getUser,
  getSwitchBtn,
  getAddUser,
  getUserId,
  getEditUser,
  getDelUser,
  getAssignRoles
}