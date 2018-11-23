// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const userCollection = db.collection('user_info');
const bookCollection = db.collection('book_info');
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const user_info = await userCollection.where({
    _openid: OPENID
  }).get();
  const book_list = await bookCollection.where({
    _openid: OPENID
  }).get();

  return {
    read_num: user_info.data[0].read_history.length,
    share_num: book_list.data.length
  }
}