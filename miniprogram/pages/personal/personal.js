// pages/personal.js
const {
  config
} = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log('用户已经授权过:',res.userInfo)
              //用户已经授权过
            },
            fail: (err)=>{
              console.log('???',err)
            }
          })
        }
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // }else{
    //   console.log('app.globalData.userInfo不存在')
    // }
    let  user =  wx.getStorageSync('userInfo')
    if (user) {
      this.setData({
        userInfo: user,
        hasUserInfo: true
      })
      app.globalData.userInfo = user
    }else{
      console.log('缓存中user不存在')
    }
  },

  onShow: function(options) {
    console.log('触发onShow事件')
    this.getUserProfile()
    var userInfo =  wx.getStorageSync('userInfo')
    if(userInfo && userInfo.nickName){
      this.setData({
          userInfo: userInfo,
          hasUserInfo: true
      })
    }
  },

  getUserProfile: function(e) {
    let _this = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync("userInfo",res.userInfo)
        this.loginToServer(res.userInfo, _this)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  // 4.13后不再支持
  bindGetUserInfo: function (e) {
    let _this = this
    console.log('我要获取用户信息了：',e.detail.userInfo)
    if (e.detail.userInfo) {
      let user = e.detail.userInfo
      app.globalData.userInfo = user
      this.loginToServer(user, _this)
    } else {
      //用户按了拒绝按钮
      console.log('用户已拒绝')
    }
  },

  login: function () {
    let _this = this
    let user = {}
    wx.showLoading({
      title: '登陆中..',
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log('未弹出过授权框')
          
        }else{
          console.log('弹出过授权框')
          wx.getUserInfo({
            withCredentials: false,
            lang: 'zh_CN',
            success: function (res) {
              user = res.userInfo
              // 登录
              _this.setData({
                userInfo: user,
                // hasUserInfo: true
              });
              app.globalData.userInfo = user
              console.log(user)
              loginToServer(user)
            },
            fail: (err) => {
              console.log(err)
            }
          })
        }
      }
    })


  },

  loginToServer: function (user,_this){
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: config.api_base_url + 'token', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              code: res.code,
              avatar_url: user.avatarUrl,
              nick_name: user.nickName,
              gender: user.gender,
              type: 100
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: res => {
              // console.log(user)
              // console.log('登录后返回', res.data)
              const code = res.statusCode.toString()
              console.log("------res:", res.data)
              if (code.startsWith('2')) {
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('openid', res.data.openid); //将openid存入本地缓存
                wx.setStorageSync('userid', res.data.userid); //将userid存入本地缓存
                if(res.data.allUserInfo.Driver){
                  wx.setStorageSync('driverid', res.data.allUserInfo.Driver.driver_id)
                }else{
                  wx.setStorageSync('driverid', '')
                }
              }

              wx.hideLoading({
                success: (res) => {
                  // _this.onLoad()
                  _this.setData({
                    hasUserInfo: true,
                    userInfo: user
                  })
                },
              })

            }
          })
        } else {
          console.log('登陆失败')
          wx.hideLoading()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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