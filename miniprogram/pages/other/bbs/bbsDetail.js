// pages/other/bbs/bbsDetail.js
const { config } = require('../../../config')
let userid = wx.getStorageSync('userid')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bbsDetail: [],
    commentList: [],
    commentListLength: '',
    hasComment: false,
    modalShow: false,
    islikebythisuser: '',
    bbs_like_count: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let bbsDetail = JSON.parse(options.bbsDetail)
    let likearr = []
    // console.log('userid',userid)
    for(let i of bbsDetail.bbsLikes){
      likearr.push(i.user_id)
    }
    // console.log('bbsDetail.bbsLikes', bbsDetail.bbsLikes)
    if(userid in likearr){
      this.setData({
        bbsDetail,
        islikebythisuser: true,
        bbs_like_count: bbsDetail.like_count
      })
    }else{
      this.setData({
        bbsDetail,
        islikebythisuser: false,
        bbs_like_count: bbsDetail.like_count
      })
    }

    // console.log(bbsDetail)
    this.getComment()
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
    // if(userid in bbsDetail.bbsLikes){
    //   this.setData({
    //     bbsDetail,
    //     islikebythisuser: true,
    //     bbs_like_count: bbsDetail.like_count
    //   })
    // }else{
    //   this.setData({
    //     bbsDetail,
    //     islikebythisuser: false,
    //     bbs_like_count: bbsDetail.like_count
    //   })
    // }
  },

  onComment: function() {
    this.setData({
      modalShow: true
    })
  },

  DisLike: function() {
    console.log('取消点赞',this.data.bbs_like_count)
    let _this = this
    let bbs_id = this.data.bbsDetail.bbs_id
    let bbs_like_count = this.data.bbs_like_count
    // let user_id = wx.getStorageSync('userid')
    wx.request({
      url: config.api_base_url + 'bbs/dislike',
      method: 'POST',
      header: {
        'content-type':'application/json'
      },
      data: {
        bbs_id,
        user_id: userid
      },
      success: (res)=>{
        wx.showToast({
          title: '取消点赞成功！',
        })
        _this.setData({
          islikebythisuser: false,
          bbs_like_count: bbs_like_count - 1
        })
        // console.log(res.data)
      },
      fail: (err)=>{
        console.log(err)
      }
    
    })
  },

  GiveLike: function() {
    let _this = this
    let bbs_id = this.data.bbsDetail.bbs_id
    let bbs_like_count = this.data.bbs_like_count
    // let user_id = wx.getStorageSync('userid')
    wx.request({
      url: config.api_base_url + 'bbs/like',
      method: 'POST',
      header: {
        'content-type':'application/json'
      },
      data: {
        bbs_id,
        user_id: userid
      },
      success: (res)=>{
        wx.showToast({
          title: '点赞成功！',
        })
        _this.setData({
          islikebythisuser: true,
          bbs_like_count: bbs_like_count + 1           
        })
        // console.log(res.data)
      },
      fail: (err)=>{
        console.log(err)
      }
    
    })
    
  },
  onSend: function(event) {
    let _this = this
    let content = event.detail.value.content
    let bbs_id = this.data.bbsDetail.bbs_id
    let user_id = wx.getStorageSync('userid')
    console.log(content,bbs_id,user_id)
    if (content.trim() == '') {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '评论中',
      mask: true,
    })


    wx.request({
      url: config.api_base_url + 'bbs/addcomment',
      method: 'POST',
      header: {
        'content-type':'application/json'
      },
      data: {
        content,
        bbs_id,
        user_id
      },
      success: (res)=>{
        wx.hideLoading()
        wx.showToast({
          title: '评论成功！',
        })
        _this.setData({
          modalShow: false
        })
        event.detail.value.content = ''
        this.getComment()
        // console.log(res.data)
      },
      fail: (err)=>{
        console.log(err)
      }
    })
  },

  getComment: function() {
    wx.request({
      url: config.api_base_url + 'bbs/getcomment/' + this.data.bbsDetail.bbs_id,
      method: 'GET',
      header: {
        'content-type':'application/json'
      },
      success: (res)=>{
        console.log('打印commentlist长度',res.data.ret_data.bbscomment_list.length)
        if(res.data.ret_data.bbscomment_list.length != 0){
          this.setData({
            hasComment: true,
            commentList: res.data.ret_data.bbscomment_list,
            commentListLength: res.data.ret_data.bbscomment_list.length
          })
        }


      },
      fail: (err)=>{
        console.log(err)
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