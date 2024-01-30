//index.js
//获取应用实例

import {Base64} from 'js-base64'
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getToken: function () {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://localhost:3000/v1/token', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              code: res.code,
              type: 100
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: res => {
              console.log('登录后返回',res.data)
              const code = res.statusCode.toString()
              if (code.startsWith('2')) {
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('openid', res.data.openid); //将openid存入本地缓存
                wx.setStorageSync('userid', res.data.userid); //将userid存入本地缓存
              }
            }
          })
        } else {
          console.log('登陆失败')
        }
      }
    })
  },


  verifyToken: function () {
    wx.request({
      url: 'http://localhost:3000/v1/token/verify', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        token:  wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
      }
    })
  },

  // 例子  前端携带Token去发起请求。
  getDataWithToken: function () {
    let token = this._encode()
    console.log(token)
    wx.request({
      url: 'http://localhost:3000/v1/getAllUser', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        Authorization: this._encode()
      },
      success: res => {
        console.log(res.data)
      }
    })
  },

  // 例子  前端携带Token去发起请求。
  getsomeData: function () {
    wx.request({
      url: 'http://localhost:3000/v1/latest', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        Authorization: this._encode()
      },
      success: res => {
        console.log(res.data)
      }
    })
  },
  
  // basic 64的加密
  _encode() {

    // Authorization: Basic base64(account:password)
    //account:password  本来是这样  但是小程序没有账号密码
    // 所以采用 token: 
    const token = wx.getStorageSync('token')
    const base64 = Base64.encode(token+':')
    return "Basic " + base64
  }

})