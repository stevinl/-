// pages/search/search.js
const { config } = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: 0,
    // 拼车信息
    msgList: [],
    userInfo: '',
    page: 1,
    allowload: true,  //是否允许下拉刷新,
    searchData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    this.getpassengerPublish()
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

  onClick: function (e){
    console.log('e.detail.index',e.detail.index)
    if(e.detail.index == 0){
      this.setData({
        showType: 0,
        msgList: []
      })
      console.log('----我切换到了乘客发布获取----')
      this.getpassengerPublish().then().catch(err=> console.log(err))
    }else{
      this.setData({
        showType: 1,
        msgList: []
      })
      console.log('-----我切换到了司机发布获取-----')
      this.getdriverPublish().then().catch(err=> console.log(err))
    }
  },
  getpassengerPublish: async function() {
    console.log('获取乘客发布')
    console.log('this.data.showType',this.data.showType)
    if(this.data.showType == 1 ){ //如果改变了头顶tab的状态  由司机发布变成了乘客发布
      this.setData({
        msgList: [],
        page: 1,
      })
    }
    let _this = this
    wx.showLoading({
      title: '加载中...',
    })
    console.log()
    wx.request({
      url:  config.api_base_url + 'passengerPublish' + '?page=' + _this.data.page,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=> {
        console.log('请求发送返回数据：',res.data.ret_data.queryResult)
        let queryResult = res.data.ret_data.queryResult
        if( _this.data.msgList.length != res.data.ret_data.queryResult.count){
          _this.setData({
            msgList: _this.data.msgList.concat(queryResult.rows),
            allowload: true,
            msglistLength: queryResult.count
          })
        }

        // _this.msgList = res.data.queryResult.rows
        wx.hideLoading()
      },
      fail: (err)=> {
        console.log(err)
        this._show_error(1)
      }
    })
  },

  getdriverPublish: async function() {
    console.log('获取司机发布')
    if(this.data.showType == 0){
      this.setData({
        msgList: [],
        page: 1
      })
    }
    let _this = this
    wx.showLoading({
      title: '加载中...',
    })
    console.log()
    wx.request({
      url:  config.api_base_url + 'driverPublish' + '?page=' + _this.data.page,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=> {
        console.log('请求发送返回数据：',res.data.ret_data.queryResult)
        let queryResult = res.data.ret_data.queryResult
        if( _this.data.msgList.length != res.data.ret_data.queryResult.count){
          _this.setData({
            msgList: _this.data.msgList.concat(queryResult.rows),
            allowload: true,
            msglistLength: queryResult.count
          })
        }

        // _this.msgList = res.data.queryResult.rows
        wx.hideLoading()
      },
      fail: (err)=> {
        console.log(err)
        this._show_error(1)
      }
    })
  },

  onChange: function (e) {
    // console.log(e.detail)
    this.setData({
      searchData: e.detail
    })
  },

  onSearch: function () {
    let _this = this
    let type = ''
    console.log('搜索', _this.data.searchData)
    wx.showLoading({
      title: '加载中',
    })
    if(this.data.showType==0){
      type = 'passengerpublish'
    }else{
      type = 'driverpublish'
    }
    wx.request({
      url: config.api_base_url + 'participator/search/'+ type +'?lookingfor=' + _this.data.searchData,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=>{
        console.log('打印数据：',res.data.ret_data)
        _this.setData({
          blogList: res.data.ret_data.queryResult.rows
        })
        wx.hideLoading()
      },
      fail: (err)=>{
        console.log(res.data.queryResult)
        wx.hideLoading()
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
    // console.log(this.data.showType)
    if(this.data.showType == 1){
      this.setData({
        msgList: [],
        page: 1
      })
      wx.showLoading({
        title: '正在刷新',
      })
      this.getdriverPublish().then(console.log('刷新成功')).catch(err=> console.log(err))
    }else{
      this.setData({
        msgList: [],
        page: 1
      })
      wx.showLoading({
        title: '正在刷新',
      })
      this.getpassengerPublish().then(console.log('刷新成功')).catch(err=> console.log(err))
    }
    // this.getdriverPublish()
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('当前加载的数量：',this.data.msgList.length)
    console.log('-----上拉刷新开始-----')
    console.log('当前第几页',this.data.page)
    if(this.data.msgList.length != this.data.msglistLength){
      console.log('现在加载第几页',this.data.page + 1)
      this.setData({
        page: this.data.page + 1
      })
      if(this.data.showType == 1){
        this.getdriverPublish().then(console.log('刷新成功')).catch(err=> console.log(err))
      }else{
        this.getpassengerPublish().then(console.log('刷新成功')).catch(err=> console.log(err))
      }

    }else{
      console.log('没有更多了')
    }
    // this.getdriverPublish().then(console.log('刷新成功')).catch(err=> console.log(err))
    // this.setData({
    //   page: this.data.page + 1
    // })
    console.log('-----下拉刷新结束-----')   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})