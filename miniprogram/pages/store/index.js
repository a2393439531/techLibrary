Page({
  data: {
    bookList:[],
    skipNum:0,
  },
  getStoreData(skipNum){
    const that = this;
    const db = wx.cloud.database();
    let books = that.data.bookList;
    skipNum = skipNum || 0;
    db.collection('book_info').limit(20).skip(skipNum).get({
      success(res) {
        that.setData({
          bookList: books.concat(res.data)
        })
      }
    })
  },
  onPullDownRefresh: function () {
    this.getStoreData();
  },

  onReachBottom:function(){
    const that = this;
    let skipNum = that.data.skipNum + 20;
    that.setData({
      skipNum: skipNum,
    });
    that.getStoreData(skipNum);
  },

  onShow(){
    const that = this;
    this.setData({
      bookList: [],
      skipNum:0,
    }, function () {
      that.getStoreData();
    });
  },
  onLoad: function (options) {
    const that = this;
    this.setData({
      bookList:[],
      skipNum: 0,
    },function(){
      that.getStoreData();
    });
   
  },
  navToBookPage(e){
    const that =this;
    const isbn = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/book/index?isbn=${isbn}&mode=borrow`,
    })
  }
})