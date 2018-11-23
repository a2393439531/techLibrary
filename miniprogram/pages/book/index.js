const app = getApp();
Page({
  data: {
    mode:'',
    isbn:'',
    bookInfo:{}
  },

  onLoad: function (options) {
    const that = this;
    var isbn = options.isbn || '9787115326560';
    var mode = options.mode || 'share';
    const db = wx.cloud.database();

    that.setData({
      isbn:isbn,
      mode:mode
    });

    db.collection('book_info').where({
      isbn13: isbn
    }).get().then((res) => {
      if(res.data.length > 0){
        this.setData({
          bookInfo:res.data[0]
        })
      }else{
        wx.request({
          url: `https://douban.uieee.com/v2/book/isbn/${isbn}`,
          header: {
            'Content-Type': 'json'
          },
          megthod: "GET",
          success: function (res) {
            that.setData({
              bookInfo: res.data,
            })
          }
        })
      }
    });
  },

  borrowBook(){
    const that = this;
    var bookInfo = that.data.bookInfo;
    wx.cloud.callFunction({
      name: 'borrowBook',
      data: {
        bookInfo: bookInfo
      }
    }).then((res)=>{
      if (res.result == 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.result,
          icon: 'none'
        })
      }
    });
  },

  goBackBook() {
    const that = this;
    var isbn = that.data.isbn;
    wx.cloud.callFunction({
      name: 'backBook',
      data: {
        isbn: isbn
      }
    }).then((res)=>{
      if(res.result == 1){
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.showToast({
          title: res.result,
          icon: 'none'
        })
      }
    });
  },

  uploadBookInfoToStore(){
    const that = this;
    var bookInfo = that.data.bookInfo;
    var userInfo = app.globalData.userInfo;
    const db = wx.cloud.database();

    bookInfo['sharer'] = userInfo.nickName;
    bookInfo['add_time'] = new Date().toLocaleDateString();
    bookInfo['status'] = 1;

    db.collection('book_info').where({
      isbn13: bookInfo.isbn13
    }).get().then((res)=>{
      if(res.data.length > 0){
        wx.showToast({
          title: '已收录该图书',
          success(){
            wx.navigateBack({
              delta: 1
            })
          }
        })   
      }else{
        db.collection('book_info').add({
          data:bookInfo
        }).then((res)=>{
          wx.navigateBack({
            delta: 1
          })
        });
      }
    })
  }
})