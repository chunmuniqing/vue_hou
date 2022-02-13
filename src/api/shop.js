import axios from './serves'
function goCategoriesList(data){
  return axios.get('/categories',{params:data})
}
function getAddCategories(data){
  return axios.post('/categories',data)
}
function getDelCategories(id){
  return axios.delete(`/categories/${id}`)
}
function getAttributes(data){
  return axios.get(`categories/${data.id}/attributes`,{params:{sel:data.sel}})
}
function getAddAttribute(data){
  return axios.post(`categories/${data.cat_id}/attributes`,{attr_name:data.attr_name,attr_sel:data.attr_sel})
}
function getEditAttribute(data){
  return axios.get(`categories/${data.id}/attributes/${data.attrId}`,{attr_sel:data.attr_sel})
}
function editAttribute(data){
  return axios.put(`categories/${data.cat_id}/attributes/${data.attr_id}`,data)
}
function delAttribute(data){
  return axios.delete(`categories/${data.cat_id}/attributes/${data.attr_id}`)
}
function editOneAttribute(data){
  return axios.put(`categories/${data.id}/attributes/${data.attrId}`,{attr_name:data.attr_name,attr_sel:data.attr_sel,attr_vals:data.attr_vals})
}
function getGoods(data){
  return axios.get(`/goods`,data)
}
function getAddGoods(data){
  return axios.post(`/goods`,data)
}
export default {
  goCategoriesList,
  getAddCategories,
  getDelCategories,
  getAttributes,
  getAddAttribute,
  getEditAttribute,
  editAttribute,
  delAttribute,
  editOneAttribute,
  getGoods,
  getAddGoods
}