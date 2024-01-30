// pages/driverPublishDetail/driverPublishDetail.js
var QQMapWX = require('../../utils/qqmap/qqmap-wx-jssdk.js')
var qqmap = new QQMapWX({
  key: 'DUZBZ-HGJCW-VT7R7-OCVXO-YFYCK-ASFCL'
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    courseInfo: {},
    course: '',
    mapWidth: 750,
    mapHeight: 600,
    latitude: '23.36525',
    longitude: '116.7054',
    scale: 20, //地图缩放级别
    markers: [], //标记坐标
    polyline: [], //绘制路线
    includePoints: [], //缩放视野以包含所有给定的坐标点
    // covers: [{
    //   latitude: '',
    //   longitude: '',
    //   iconPath: ''
    // }, {
    //   latitude: '',
    //   longitude: '',
    //   iconPath: ''
    // }],
    // polyline:[], //路线,
    // includePoints: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let _this = this
    let course = JSON.parse(options.course)
    wx.showLoading({
      title: '加载中...',
    });
    this.setData({
      showType: options.showType,
      courseInfo: course,
      markers: [{
        id: 1,
        latitude: course.start_latitude,
        longitude: course.start_longitude,
        width: 50,
        height: 50,
        label: '起点'
      }, {
        id: 2,
        latitude: course.end_latitude,
        longitude: course.end_longitude,
        width: 50,
        height: 50,
        label: '终点'
      }],
      // includePoints: [{
      //   latitude: course.start_latitude,
      //   longitude: course.start_longitude,
      // }, {
      //   latitude: course.end_latitude,
      //   longitude: course.end_longitude,
      // }]

    });
    // // console.log(this.data.markers)
    // //网络请求设置
    let startPos = course.start_latitude + ',' + course.start_longitude;
    let endPos = course.end_latitude + ',' + course.end_longitude;
    qqmap.direction({
      mode: 'driving',
      from: startPos,
      to: endPos,
      success: function (res) {
        var ret = res
        // if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来
        _this.setData({
          polyline: [{
            points: pl,
            color: '#00b26a',
            width: 8,
            arrowLine: true
          }],
          longitude: pl[0].longitude,
          latitude: pl[0].latitude,
          isShow: true,
          includePoints: [{
            latitude: course.start_latitude,
            longitude: course.start_longitude,
          }, {
            latitude: course.end_latitude,
            longitude: course.end_longitude,
          }]
        })
        wx.hideLoading()
      },
      fail: function (err) {
        console.error(err)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.mapCtx = wx.createMapContext('myMap');//获取地图对象同canvas相似，获取后才能调用相应的方法
    // this.mapCtx.moveToLocation();//将当前位置移动到地图中心
    // this.mapCtx.includePoints({
    //   padding: [100],
    //   points: []
    // })
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