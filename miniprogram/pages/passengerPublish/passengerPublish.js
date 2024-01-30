// pages/passengerPublish/passengerPublish.js

// 引入SDK核心类，js文件根据自己业务，位置可自行放置
const { config } = require('../../config')
var QQMapWX = require('../../utils/qqmap/qqmap-wx-jssdk.js')
var qqmap = new QQMapWX({
  key: 'DUZBZ-HGJCW-VT7R7-OCVXO-YFYCK-ASFCL'
})

const searchObj = {}
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    latitude: '23.41615',
    longitude: '116.62940',
    startAddressInfo: '',
    endAddressInfo: '',
    searRange: [1, 2, 3, 4, 5, 6, 7, 8],
    index: -1,
    date: '',
    time: '',
    useid: ''
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
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
    let _this = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        _this.setData({
          latitude,
          longitude
        })
        // 调用接口
        qqmap.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: function (res) {
            // console.log(res.result.address)
            _this.setData({
              startAddressInfo: res.result.address
            })
          },
          fail: function (res) {
            console.log('fail', res);
          },
          complete: function (res) {
            console.log('complete', res);
          }
        })
        // 调用接口结束
      }
    })
  },


  // 余座数量绑定
  bindNumChange: function (e) {
    // console.log(e.detail)
    this.setData({
      index: e.detail.value
    })
  },

  //时间选择
  TimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 日期选择
  DateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    // 设置 跳转搜索页面参数
    searchObj.date = e.detail.value
  },
  /**
   * 表单验证
   * @param {*} e 
   */
  submitForm: function (e) {
    // console.log('---表单提交---')
    let submitFlag = true
    let formData = e.detail.value

    if (submitFlag = true) {
      // 开始处理提交
      wx.showLoading({
        title: '发布中',
        mask: true //产生出一个蒙版，使用户不能再继续进行操作
      })
      let userInfo = wx.getStorageSync('userInfo')
      formData.startAddressInfo = this.data.startAddressInfo
      formData.endAddressInfo = this.data.endAddressInfo

      formData.nickName = userInfo.nickName

      formData.openid = wx.getStorageSync('openid')
      formData.userid = wx.getStorageSync('userid')
      console.log('处理提交中的formdata', formData)
      // postDriverPublishModel.postData(formData)
      // .then(
      //   wx.hideLoading(),
      //   wx.redirectTo({
      //     url: '../../pages/search/search',
      //   })
      //   )
      // .catch(
      //   wx.hideLoading()
      // )
      wx.request({
        url: config.api_base_url + 'passengerPublish/add',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          formData
        },
        success: (res) => {
          console.log(res.data.ret_data)
          wx.hideLoading()
          wx.redirectTo({
            url: '../../pages/search/search',
          })

        },
        fail: (err) => {
          console.log(err)
          wx.showToast({
            title: '服务器异常',
          })
        }
      })

    }
  },
  bindSelectEnd: function (e) {
    let _this = this;
    wx.chooseLocation({
      success: function (res) {
        // 解析地址获取 市区县等信息
        qqmap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res2) {
            // 设置 跳转搜索页面参数
            searchObj.endAddress = {
              name: res.name,
              city: res2.result.address_component.city,
              latitude: res.latitude,
              longitude: res.longitude
            }
            _this.setData({
              endAddressInfo: {
                name: res.name,
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude,
                addressComponent: res2.result.address_component
              }
            })
          },
          fail: function (res) {
            console.log('绑定终点位置出差错', res)
          }
        })
      }
    })
  },

  bindSelectStart: function (e) {
    let _this = this;
    wx.chooseLocation({
      success: function (res) {
        qqmap.reverseGeocoder({
          success: function (res2) {
            searchObj.startAddress = {
              name: res.name,
              city: res2.result.address_component.city,
              latitude: res.latitude,
              longitude: res.longitude
            }
            _this.setData({
              startAddressInfo: {
                name: res.name,
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude,
                addressComponent: res2.result.address_component
              }
            })
          },
          fail: function (res) {
            console.log('绑定初始位置出差错', res)
          }
        })
      }
    })
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