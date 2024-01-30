// pages/other/bbs/bbsPublish.js
const { config } = require('../../../config')
const app = getApp()
const MAX_WORDS_NUM = 140
let content = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    userid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData)
    this.setData({
      userid: wx.getStorageSync('userid')
    })
  },

  textareaAInput(event) {
    // console.log(event.detail.value)
    var wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM){
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },
  send: function(){
    let that = this
    console.log(content)
    wx.showLoading({
      title: '发布中',
      mask: true      //产生出一个蒙版，使用户不能再继续进行操作
    })
    wx.request({
      url: config.api_base_url + 'bbs/add',
      method: 'POST',
      header: {
        'content-type':'application/json'
      },
      data:{
        userid: this.data.userid,
        content,
      },
      success:(res)=>{
        console.log(res.data)
        wx.hideLoading()
        wx.showToast({
          title: '发布成功！自动跳转',
        })
        setTimeout(function () {
          // wx.redirectTo({
          //   url: '../bbs/bbs',
          //   success:()=>{
          //     let page = getCurrentPages().pop()
          //     console.log(page)
          //     if(!page) return 
          //     page.onLoad()
          //  }
          // })
          wx.navigateBack({ 
            success:()=>{
              let page = getCurrentPages().pop()
              console.log(page)
              if(!page) return 
              page.onLoad()
           }
          });
        }, 1000)
        
      },
      fail:(err)=>{
        console.log(err)
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