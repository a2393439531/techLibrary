const app = getApp();
Page({
  data: {
    isLogin:false,
    userInfo:null,
    cameraShown:false,
    navLock:false,
  },
  onLoad: function () {
    const that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setUserInfo(res);
            }
          })
        }
      }
    });
    wx.cloud.callFunction({
      name: 'myData'
    }).then((res)=>{
      that.setData({
        read_num:res.result && res.result.read_num,
        share_num: res.result && res.result.share_num,
      })
    })
  },
  onShow:function(){
    wx.cloud.callFunction({
      name: 'myData'
    }).then((res) => {
      that.setData({
        read_num: res.result && res.result.read_num,
        share_num: res.result && res.result.share_num,
      })
    })
  },
  setUserInfo(res){
    var that = this;
    const db = wx.cloud.database();
    that.setData({
      userInfo: res.userInfo,
      isLogin: true,
    })
    app.globalData.userInfo = res.userInfo;

    wx.cloud.callFunction({
      name: 'login',
      data: {
        uInfo:res.userInfo
      }
    }).then(console.log);
  },
  getCameraAuth(callBak){
    var that = this;
    var ctx = null;
    that.setData({
      cameraShown: true,
    });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              that.setData({
                canUseCamera: true,
              })
              ctx = wx.createCameraContext();
            }
          })
        }else{
          ctx = wx.createCameraContext();
        }
      }
    })
  },
  bindGetUserInfo(e) {
    var that = this;
    that.setUserInfo(e.detail);
  },
  upLoadBookInfo() {
    var that = this;
    that.getCameraAuth();
    this.setData({
      mode:'share'
    })
  }, 
  borrowBook(){
    var that = this;
    that.getCameraAuth();
    this.setData({
      mode: 'borrow',
      navLock: false,
    })
  },
  backBook(){
    var that = this;
    that.getCameraAuth();
    this.setData({
      mode: 'back',
      navLock: false,
    })
  },
  onShow(){
    this.setData({
      navLock: false,
    })
  },
  handleBookInfo(e){
    var that = this;
    var isbnCode = e.detail.result;
    var navLock = that.data.navLock;
    if(!navLock){
      that.setData({
        navLock: true
      },function(){
        wx.navigateTo({
          url: `/pages/book/index?isbn=${isbnCode}&mode=${that.data.mode}`
        })
      })
    }
  },
})