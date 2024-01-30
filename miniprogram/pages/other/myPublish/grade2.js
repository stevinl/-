// miniprogram/pages/other/myPublish/grade2.js
const { config } = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    score_value: 0,
    first_name: '',
    btncolor: false,
    isscore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = JSON.parse(options.item)
    // this.setData({
    //   item,
    //   first_name: item.driverPublish.User.Driver.driver_name.split('')[0],
    // })
    // console.log(item)
    this.getDetail(item.id)
  },

  //获取详细数据
  getDetail:function (id) {
    let _this = this 
    wx.request({
      url: config.api_base_url + 'participator/search/participator/' + id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let item_detail = res.data.ret_data.participator_list
        console.log('item_detail:',item_detail)
        let isscore = false
        if(item_detail.score){
            isscore= true
        }
        _this.setData({
          item: item_detail,
          isscore,
          first_name: item_detail.driverPublish.User.Driver.driver_name.split('')[0],
        })
      },
      fail: (err) => {
        console.log(err)
        wx.showToast({
          title: '失败！出现未知情况',
        })
      }
    })
  },

  onChange: function (e) {
    console.log('此时星星数：',e.detail)
    this.setData({
      score_value: e.detail,
      btncolor: true
    })
  },

  GiveEvaluate: function (e) {
    let score_value = this.data.score_value
    let id = this.data.item.id
    wx.request({
      url: config.api_base_url + 'participator/grade/part/' + id,
      method: 'PUT',
      header: {
        'content-type': 'application/json'
      },
      data: {
        score: score_value
      },
      success: (res) => {
          wx.showToast({
            title: '评分成功',
          })
      },
      fail: (err) => {
        console.log(err)
        wx.showToast({
          title: '失败！出现未知情况',
        })
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