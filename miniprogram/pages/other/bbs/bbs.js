// pages/other/bbs/bbs.js
const { config } = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogtype: 0,
    blogList: [],
    page: 1,
    pagecount: '',
    searchData : '',
    value: '',
    dynamicCard: [
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      },
      {
        title: '动态插入数据示例',
        content: '点击下面按钮动态插入一条数据，模拟上拉加载更多的业务场景'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.setData({
    //   blogList: []
    // })
    this.getbbslist(1)
    // console.log('总共页数:', this.data.pagecount)
    // console.log('当前第几页',this.data.page)
  },

  getbbslist: async function(page) {
    let _this  = this
    wx.showLoading({
      title: '加载中...',
    })


    wx.request({
      url: config.api_base_url + 'bbs' + '?page=' + page,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=>{
        console.log('----------------------------------------')
        console.log('console.log请求数据请求第几页的page：', page)
        console.log(res.data.ret_data.data)
          _this.setData({
            blogList: _this.data.blogList.concat(res.data.ret_data.data),
            pagecount: res.data.ret_data.pageCount
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

  // onPageScroll(e) {
  //   this.setData({
  //     scrollTop: e.scrollTop
  //   });
  // },

  lookBlogDetail: function(e) {
    // console.log(e.currentTarget.dataset.item)
    const bbsDetail = e.currentTarget.dataset.item
    wx.navigateTo({
      // url: '../../pages/driverPublishDetail/driverPublishDetail?course=' + JSON.stringify(courseObj) + '&showType=' + this.data.showType
      url: './bbsDetail?bbsDetail=' + JSON.stringify(bbsDetail)
    })
  },

  tabchange: function(e) {
    // console.log(e.detail.currentIndex)
    this.setData({
      blogtype: e.detail.currentIndex
    })
  },

  onPageScroll: function(res) {
    this.setData({
      scrollTop: res.scrollTop
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
    this.setData({
      blogList: [],
      page: 1,
      pagecount: '',
    })
    this.getbbslist()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('总共页数:', this.data.pagecount)
    console.log('当前this.data.page:',this.data.page)
    if(this.data.page < this.data.pagecount){
      console.log('当前请求第',this.data.page + 1)
      this.setData({
        page: this.data.page + 1
      })
      this.getbbslist(this.data.page)
    }else{
      wx.showToast({
        title: '没有更多了',
      })
      console.log('没有更多了')
    }
    // this.onLoad()
  },

  onChange: function (e) {
    // console.log(e.detail)
    this.setData({
      searchData: e.detail
    })
  },

  onSearch: function () {
    let _this = this
    console.log('搜索')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.api_base_url + 'bbs/search?lookingfor=' + this.data.searchData,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=>{
        console.log(res.data.ret_data)
        _this.setData({
          blogList: res.data.ret_data.queryResult.rows
        })
        wx.hideLoading()
      },
      fail: (err)=>{
        console.log(res.data.queryResult)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})