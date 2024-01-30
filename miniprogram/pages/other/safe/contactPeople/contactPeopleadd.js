// miniprogram/pages/other/safe/contactPeople/contactPeopleadd.js
let user_id = wx.getStorageSync('userid')
const { config } = require('../../../../config')
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

  submitForm: function (e) {
    let user_id = wx.getStorageSync('userid')
    console.log(e.detail.value)
    wx.showLoading({
      title: '上传中',
    })
    wx.request({
      url: config.api_base_url + 'user/addcontactpeople',
      method: 'POST',
      header: {
        'content-type':'application/json'
      },
      data:{
        name: e.detail.value.contact_name,
        phone_num: e.detail.value.contact_num,
        user_id: user_id
      },
      success: (res)=>{
        wx.hideLoading({
          success: (res) => {
            wx.navigateBack({
              success:()=>{
                let page = getCurrentPages().pop()
                console.log(page)
                if(!page) return 
                page.onShow()
             }
            })
          },
        })        
      },
      fail: (err)=>{
        console.log(err)
        wx.showToast({
          title: '服务器异常',
        })
      }
    })
    
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

  }
})