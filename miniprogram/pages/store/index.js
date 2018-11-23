Page({
  data: {
    bookList:[]
  },
  getStoreData(){
    const that = this;
    const db = wx.cloud.database();

    db.collection('book_info').limit(1000).get({
      success(res) {
        that.setData({
          bookList: res.data
        })
      }
    })
  },
  onPullDownRefresh: function () {
    this.getStoreData();
  },
  onShow(){
    this.getStoreData();
  },
  onLoad: function (options) {
    this.getStoreData();
  },
  navToBookPage(e){
    const that =this;
    const isbn = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/book/index?isbn=${isbn}&mode=borrow`,
    })
  }
})