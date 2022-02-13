import { Message } from 'element-ui';

export function error(res){
  if ((res.meta.status !== 200) && (res.meta.status !== 201)) {
     Message.error(res.meta.msg)
  }
  return false;
}