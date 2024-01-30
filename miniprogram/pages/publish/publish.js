// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  passengerPublish: function () {
    this.getSetting()
    .then(() => {
      wx.navigateTo({
        url: '../passengerPublishHistory/passengerPublishHistory',
      })
    })
    .catch(() => {
      wx.showModal({
        title: '授权提示',
        content: '此程序需要授权才能继续进行使用！点击确定进行授权',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../authorization/authorization',
            })
          }
        }
      })
    })
  },

  driverPublish: function () {
    wx.navigateTo({
        url: '../driverPublishHistory/driverPublishHistory',
      })
    // this.getSetting()
    // .then(() => {
    //   wx.navigateTo({
    //     url: '../driverPublishHistory/driverPublishHistory',
    //   })
    // })
    // .catch(() => {
    //   wx.showModal({
    //     title: '授权提示',
    //     content: '此程序需要授权才能继续进行使用！点击确定进行授权',
    //     success(res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '../authorization/authorization',
    //         })
    //       }
    //     }
    //   })
    // })
  },
  /**
   * wx.getSetting 授权检测
   * wx.getSetting 在 未拒绝 和 未同意 状态下 ，success: (res) => { } 的res.authSetting{}值是空的!
   * 在getUserInfo()后，点击拒绝后 wx.getSetting的fail:(res)=>{}触发，res.authSetting['scope.userInfo'] 的值是false ，表示scope.userInfo这个* 权限没有授权。

   * 在getUserInfo()后，点击同意后 wx.getSetting的success:(res)=>{}触发，res.authSetting['scope.userInfo'] 的值是true，表示scope.userInfo这个
   * 权限已经授权。
   */
  getSetting: function () {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          console.log('是否有授权',res.authSetting['scope.userInfo'])
          if (res.authSetting['scope.userInfo']) {
            resolve()
          } else {
            reject()
          }
        }
      })
    })
  }
})