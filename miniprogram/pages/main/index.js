Page({

  data: {
    userList:[],
    skipNum:0,
  },
  onPullDownRefresh: function () {
    const that = this;
    this.setData({
      userList: [],
      skipNum: 0,
    }, function () {
      that.getMainData();
    });
  },
  onShow: function(){
    const that = this;
    this.setData({
      userList: [],
      skipNum: 0,
    }, function () {
      that.getMainData();
    });
  },
  onReachBottom: function () {
    const that = this;
    let skipNum = that.data.skipNum + 20;
    that.setData({
      skipNum: skipNum,
    });
    that.getMainData(skipNum);
  },

  getMainData(skipNum){
    const that = this;
    const db = wx.cloud.database();
    let users = that.data.userList;
    skipNum = skipNum || 0;
    db.collection('user_info').limit(20).skip(skipNum).get({
      success(res) {
        var temData = res.data.filter(function(item){
          return item.reading_status == 1;
        })
        that.setData({
          userList: users.concat(temData)
        })
      }
    })
  },
  onLoad: function (options) {
    const that = this;
    this.setData({
      userList: [],
      skipNum: 0,
    }, function () {
      that.getMainData();
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: '新氧图书馆'
    }
  }
})