// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const bookCollection = db.collection('book_info');
const userCollection = db.collection('user_info');
// 云函数入口函数
exports.main = async (event, context) => {
  const { isbn } = event;
  const { OPENID } = cloud.getWXContext();
  const book_info = await bookCollection.where({
    isbn13: isbn
  }).get();
  const user_info = await userCollection.where({
    reading:{
      isbn13: isbn,     
    }
  }).get();
  
  if(book_info.data[0]._openid === OPENID){
    await bookCollection.doc(book_info.data[0]._id).update({
      data: {
        back_time: new Date().toLocaleDateString(),
        status: 1,
      }
    });

    await userCollection.doc(user_info.data[0]._id).update({
      data: {
        reading_status: 0,
      }
    })
    return 1;
  }else{
    return '请让书籍拥有者扫码确认还书！'
  }
}