// pages/other/myPublish/myPublish.js
const {
  config
} = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList : [],
    itemstatus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  doGrade: function (e) {
    let item = e.currentTarget.dataset.item
    // console.log(e)
    wx.navigateTo({
      // url: '../../pages/driverPublishDetail/driverPublishDetail?course=' + JSON.stringify(courseObj) + '&showType=' + this.data.showType
      url: './grade2?item=' + JSON.stringify(item)
    })
  },

  getList: async function () {
    let _this = this 
    let user = wx.getStorageSync('userid')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.api_base_url + 'participator/search/user/' + user,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res)=>{
        let dataList = res.data.ret_data.queryResult.rows
        if(res.data.code == 200 && dataList.length != 0){
          this.setData({
            dataList: dataList
          })
          
        }else{
          console.log('无数据')
        }
        wx.hideLoading()
      }
    })
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
    this.getList()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
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
