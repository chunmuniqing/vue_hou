import axios from './serves'
function getAllRights(data){
  return axios.get(`/rights/${data}`)
}
function getAllRoles(data){
  return axios.get(`/roles`)
}
function getDelRoles(row,id){
  return axios.delete(`/roles/${row.id}/rights/${id}`)
}
function getRoleRights(id,data){
  return axios.post(`roles/${id}/rights`,{rids:data})
}

export default {
  getAllRights,
  getAllRoles,
  getDelRoles,
  getRoleRights
}