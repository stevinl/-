// pages/explore.js

const app = getApp();
const {
  config
} = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startitem: [],
    swiperList: [{
      id: 0,
      type: 'image',
      url: '../../images/STU1.jpg'
    }, {
      id: 1,
        type: 'image',
        url: '../../images/STU2.jpg',
    }, 
    // {
    //   id: 2,
    //   type: 'image',
    //   url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    // }, {
    //   id: 3,
    //   type: 'image',
    //   url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    // }
  ],
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: '探索',
      url: '../search/search'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '我参与的',
      url: '../other/myPublish/myparticipate'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '接口测试',
      url: '../index/index'
    }, {
      icon: 'noticefill',
      color: 'olive',
      badge: 22,
      name: '通知',
      url: '../driverPublishConfirm/confirm'
    }, {
      icon: 'discoverfill',
      color: 'purple',
      badge: 0,
      name: '拼车论坛',
      url: '../other/bbs/bbs'
    },{
      icon: 'upstagefill',
      color: 'cyan',
      badge: 0,
      name: '我发布的',
      url: '../other/myPublish/myPublish'
    }, {
      icon: 'clothesfill',
      color: 'blue',
      badge: 0,
      name: '皮肤'
    },  {
      icon: 'questionfill',
      color: 'mauve',
      badge: 0,
      name: '帮助'
    }, {
      icon: 'commandfill',
      color: 'purple',
      badge: 0,
      name: '问答'
    }, {
      icon: 'brandfill',
      color: 'mauve',
      badge: 0,
      name: '版权'
    }],
    gridCol:3 //列数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gettodaystart()
  },

  gettodaystart: function () {
    let _this = this
    let user = wx.getStorageSync('userid')
    wx.request({
      url: config.api_base_url + 'participator/searchrecent/user/' + user,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success:(res)=>{
        console.log(res.data)
        if(res.data.ret_data.queryResult){
          _this.setData({
            startitem: [res.data.ret_data.queryResult],
            // starttime:
          })
        }


        wx.hideLoading()
        wx.showToast({
          title: '加载成功',
        })
        setTimeout(function () {
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
    this.gettodaystart()
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