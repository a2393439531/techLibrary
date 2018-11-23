// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const userCollection = db.collection('user_info');
const bookCollection = db.collection('book_info');
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const { bookInfo } = event;
  const { OPENID } = cloud.getWXContext();
  const user_info = await userCollection.where({
    _openid: OPENID
  }).get();
  const book_info = await bookCollection.where({
    isbn13: bookInfo.isbn13
  }).get();
  if (user_info.data[0].reading_status){
    return '您已有在读，请先归还给书籍拥有者';
  }
  await userCollection.doc(user_info.data[0]._id).update({
    data:{
      reading_status:1,
      reading_book: {
        isbn13: bookInfo.isbn13,
        book_name: bookInfo.title,
        book_image: bookInfo.image,
      },
      read_history: _.push([{
        isbn13: bookInfo.isbn13,
        book_name: bookInfo.title,
        book_image: bookInfo.image,
      }])
    }
  });
  if(book_info.data.length === 0){
    const { _id } = await bookCollection.add({
      data:{
        ...bookInfo,
        status: 0,
        borrow_time: new Date().toLocaleDateString()
      }
    })
    await bookCollection.doc(_id).update({
      data:{
        readers: _.push([{ name: user_info.data[0].nickName, _openid: user_info.data[0]._openid }]),
      }
    })
    return 1;
  }else{
    await bookCollection.doc(book_info.data[0]._id).update({
      data: {
        readers: _.push([{ name: user_info.data[0].nickName, _openid: user_info.data[0]._openid}]),
        status: 0,
        borrow_time: new Date().toLocaleDateString()
      }
    })
    return 1;
  } 
}