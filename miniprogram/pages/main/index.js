Page({

  data: {
    userList:[]
  },
  onPullDownRefresh: function () {
    this.getMainData();
  },
  onShow: function(){
    this.getMainData();
  },

  getMainData(){
    const that = this;
    const db = wx.cloud.database();

    db.collection('user_info').limit(100).get({
      success(res) {
        var temData = res.data.filter(function(item){
          return item.reading_status == 1;
        })
        that.setData({
          userList: temData
        })
      }
    })
  },
  onLoad: function (options) {
    this.getMainData();
  },
})