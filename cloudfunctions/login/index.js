// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID } = cloud.getWXContext();
  let { uInfo } = event;
  let user_info = await db.collection('user_info').where({
    _openid:OPENID
  }).get();

  if (user_info.data.length === 0) {
    return db.collection('user_info').add({
      data: { ...uInfo, _openid: OPENID }
    })
  } else {
    return db.collection('user_info').doc(user_info.data[0]._openid).update({
      data: { ...uInfo }
    })
  }
    
}