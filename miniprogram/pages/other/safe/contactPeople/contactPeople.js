// miniprogram/pages/other/safe/contactPeople/contactPeople.js
const { config } = require('../../../../config')
let user_id = wx.getStorageSync('userid')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact_peoplelist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getContactPeople()
  },

  toAddcontactPeople: function (){
    wx.navigateTo({
      url: './contactPeopleadd',
    })
  },

  getContactPeople: function(){
    let user_id = wx.getStorageSync('userid')
    wx.showLoading({
      title: '加载中',
    })
    let _this = this
    wx.request({
      url: config.api_base_url + 'user/getcontactpeople/' + user_id,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=>{
        _this.setData({
          contact_peoplelist: res.data.ret_data.queryResult.rows,
        })
        wx.hideLoading()
        
      },
      fail: (err)=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常',
        })
      }
    })
  },

  deleteContactPeople: function() {
    wx.showLoading({
      title: '加载中',
    })
    let _this = this
    wx.request({
      url: config.api_base_url + 'user/getcontactpeople/' + user_id,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=>{
        _this.setData({
          contact_peoplelist: res.data.ret_data.queryResult.rows,
        })
        wx.hideLoading()
        
      },
      fail: (err)=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常',
        })
      }
    })
  },

  onClose(event) {
    const { position, instance } = event.detail;
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    let _this = this
    if(position === 'right'){
      wx.showModal({
        title: '警告',
        content: '您确定要删除吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: config.api_base_url + 'user/deletecontactpeople/',
              method: 'DELETE',
              header: {
                'content-type':'application/json'
              },
              data:{
                id
              },
              success: (res)=>{
                _this.onLoad()
                
              },
              fail: (err)=>{
                console.log(err)
                wx.showToast({
                  title: '服务器异常',
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    }
    // switch (position) {
    //   case 'left':
    //   case 'cell':
    //     instance.close();
    //     break;
    //   case 'right':
    //     Dialog.confirm({
    //       message: '确定删除吗？',
    //     }).then(() => {
    //       instance.close();
    //     });
    //     break;
    // }
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
    this.getContactPeople()
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