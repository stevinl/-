const app = getApp()
var QQMapWX = require('../../utils/qqmap/qqmap-wx-jssdk.js')
const {
  config
} = require('../../config')
var qqmap = new QQMapWX({
  key: 'DUZBZ-HGJCW-VT7R7-OCVXO-YFYCK-ASFCL'
})

const {
  formatTime2
} = require('../../utils/util')
const searchObj = {}
var driverPublish_id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // Star 数量
    starCount: null,
    userInfo: {},
    isShow: false,
    courseInfo: {},
    course: {},
    mapWidth: 750,
    mapHeight: 1200,
    latitude: '23.36525',
    longitude: '116.7054',
    scale: 13, //地图缩放级别
    skew: 55, //地图倾斜角度
    markers: [], //标记坐标
    polyline: [], //绘制路线
    includePoints: [], //缩放视野以包含所有给定的坐标点
    userInfo: {},
    publishuser_id: '',
    show: false,
    startAddressInfo: {},
    endAddressInfo: {},
    tmp_detail: {},
    tmp_time: '',
    tmp_date: '',
    tmp_start_name: '',
    tmp_end_name: '',
    tmp_personNum: '',
    tmp_price: '',
    tmp_phone: '',
    tmp_note: '',
    avatar_url: ''
  },

  onLoad(options) {
    console.log('app.globalData', app.globalData)


    let _this = this
    let course = JSON.parse(options.course)
    
    driverPublish_id = course.id
    this.getDetail(course.id, options)
    this.setData({
      avatar_url: course.User.avatar_url
    })
    // let publishuser_id = wx.getStorageSync('userid')
    // let owner
    // if (publishuser_id != course.user_id) {
    //   //说明不是创建订单的人进入
    //   console.log('我不是创建人')
    //   owner = false
    // } else {
    //   console.log('我是创建人')
    //   owner = true
    // }
    // wx.showLoading({
    //   title: '加载中...',
    // });
    // this.setData({
    //   showType: options.showType,
    //   courseInfo: course,
    //   userInfo: app.globalData.userInfo,
    //   publishuser_id,
    //   owner,
    //   markers: [{
    //     id: 1,
    //     latitude: course.start_latitude,
    //     longitude: course.start_longitude,
    //     width: 50,
    //     height: 50,
    //     label: '起点'
    //   }, {
    //     id: 2,
    //     latitude: course.end_latitude,
    //     longitude: course.end_longitude,
    //     width: 50,
    //     height: 50,
    //     label: '终点'
    //   }]
    // });
    // // // console.log(this.data.markers)
    // // //网络请求设置
    // let startPos = course.start_latitude + ',' + course.start_longitude;
    // let endPos = course.end_latitude + ',' + course.end_longitude;
    // qqmap.direction({
    //   mode: 'driving',
    //   from: startPos,
    //   to: endPos,
    //   success: function (res) {
    //     var ret = res
    //     // if (ret.status != 0) return; //服务异常处理
    //     var coors = ret.result.routes[0].polyline,
    //       pl = [];
    //     //坐标解压（返回的点串坐标，通过前向差分进行压缩）
    //     var kr = 1000000;
    //     for (var i = 2; i < coors.length; i++) {
    //       coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
    //     }
    //     //将解压后的坐标放入点串数组pl中
    //     for (var i = 0; i < coors.length; i += 2) {
    //       pl.push({
    //         latitude: coors[i],
    //         longitude: coors[i + 1]
    //       })
    //     }
    //     //设置polyline属性，将路线显示出来
    //     _this.setData({
    //       polyline: [{
    //         points: pl,
    //         color: '#00b26a',
    //         width: 8,
    //         arrowLine: true
    //       }],
    //       longitude: pl[0].longitude,
    //       latitude: pl[0].latitude,
    //       isShow: true,
    //       includePoints: [{
    //         latitude: course.start_latitude,
    //         longitude: course.start_longitude,
    //       }, {
    //         latitude: course.end_latitude,
    //         longitude: course.end_longitude,
    //       }]
    //     })
    //     wx.hideLoading()
    //   },
    //   fail: function (err) {
    //     console.error(err)
    //   },
    //   complete: function (res) {
    //     console.log(res)
    //   }
    // })
  },

  onShow: function () {
    let ID = driverPublish_id
    console.log('onShow再次请求数据')
    this.getDetail(ID)
  },


  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  onShareAppMessage: function () {

  },

  /**
   * 获取 Star 数量，有些网络无法访问，暂时不用
   */
  getStarCount() {
    const that = this;
    wx.request({
      url: 'https://api.github.com/repos/TaleLin/lin-ui',
      success(res) {
        let starCount = res.data.stargazers_count;
        starCount = (starCount / 1000).toFixed(1);
        that.setData({
          starCount
        });
      }
    });
  },

  getDetail2: function (id){

  },
  /**
   * 通过publish_id去请求数据
   */
  getDetail: function (id) {
    let _this = this
    wx.request({
      url: config.api_base_url + 'driverPublish/search/' + id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        // _this.onLoad()
        console.log('打印一下数据：', res.data.ret_data)

        const course = res.data.ret_data.queryResult

        searchObj.startAddress = {
          name: course.start_name,
          address: course.start_address,
          latitude: course.start_latitude,
          longitude: course.start_longitude,
          addressComponent: {
            nation: course.start_nation,
            province: course.start_province,
            city: course.start_city,
            district: course.start_district,
            street: course.start_street,
            street_number: course.start_streetnumber
          }
        }


        searchObj.endAddress = {
          name: course.end_name,
          address: course.end_address,
          latitude: course.end_latitude,
          longitude: course.end_longitude,
          addressComponent: {
            nation: course.end_nation,
            province: course.end_province,
            city: course.end_city,
            district: course.end_district,
            street: course.end_street,
            street_number: course.end_streetnumber
          }
        }


        let publishuser_id = wx.getStorageSync('userid')
        let owner
        if (publishuser_id != course.user_id) {
          //说明不是创建订单的人进入
          console.log('我不是创建人')
          owner = false
        } else {
          console.log('我是创建人')
          owner = true
        }
        wx.showLoading({
          title: '加载中...',
        });
        // console.log(formatTime2(JSON.parse(options.course).start_time, 'Y-M-D h:m'))
        // let timeArr = formatTime2(JSON.parse(options.course).start_time, 'Y-M-D h:m').split(' ')
        let timeArr = formatTime2(course.start_time, 'Y-M-D h:m').split(' ')
        _this.setData({
          // tmp_detail: JSON.parse(options.course),
          tmp_detail: course,
          tmp_date: timeArr[0],
          tmp_time: timeArr[1],
          tmp_start_name: course.start_name,
          tmp_end_name: course.end_name,
          tmp_note: course.note,
          tmp_personNum: course.personNum,
          tmp_phone: course.phone,
          tmp_price: course.price,
          // showType: options.showType,
          courseInfo: course,
          course,
          userInfo: app.globalData.userInfo,
          publishuser_id,
          owner,
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
          }]
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
      fail: (err) => {
        console.log(err)
        wx.showToast({
          title: '服务器异常',
        })
      }
    })

  },

  bindJoin() {
    let _this = this
    console.log('申请加入')
    this.joinRequest(_this)
    //获取授权的点击事件

    wx.requestSubscribeMessage({
      tmplIds: ['Az3FYgrZm5uu6jNNoI0KIyy7Xlif7Q2GO7Uh2Yj4F2E'], //这里填入我们生成的模板id
      success(res) {
        console.log('授权使用成功', res)
      },
      fail(res) {
        console.log('授权失败', res)
      }
    })

    wx.showModal({
      title: '提示',
      content: '你确定加入吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: "sendMsg",
            data: {
              openid: _this.data.courseInfo.User.openid
            }
          }).then(res => {
            console.log("推送消息成功", res)
          }).catch(res => {
            console.log("推送消息失败", res)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  joinRequest: function (_this) {
    wx.showLoading({
      title: '请求中',
    })
    let that = _this
    let participator = {}
    participator['user_id'] = wx.getStorageSync('userid')
    participator['driverpublish_id'] = that.data.courseInfo.id
    wx.request({
      url: config.api_base_url + 'driverPublish/addParticipator',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        participator
      },
      success: (res) => {
        console.log(res.data)
        wx.hideLoading()
        wx.showToast({
          title: '申请成功',
        })
        // setTimeout(function () {
        //   that.onLoad()
        // }, 1000)

      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  /**
   * 监听：长按左侧按钮
   */
  onLongPressLeft() {
    wx.vibrateShort();
    wx.showModal({
      title: '提示',
      content: '长按左侧按钮事件被触发'
    });
  },

  /**
   * 监听：长按右侧按钮
   */
  onLongPressRight() {
    wx.vibrateShort();
    wx.showModal({
      title: '提示',
      content: '长按右侧按钮事件被触发'
    });
  },

  /**
   * 监听：点击 Star 卡片
   */
  onTapStarCard() {
    wx.vibrateShort();
    wx.setClipboardData({
      data: 'https://github.com/TaleLin/lin-ui'
    });
  },

  /**
   * 监听：点击公众号卡片
   */
  onTapPublicCard() {
    wx.vibrateShort();
    wx.setClipboardData({
      data: '林间有风'
    });
  },


  // 订单拥有人修改订单信息。
  submitForm: function (e) {
    let _this = this
    console.log(e.detail)
    console.log('searchObj:', searchObj)
    let formData = e.detail.value
    wx.showModal({
      title: '提示',
      content: '你确定要修改吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定修改')
          wx.showLoading({
            title: '修改中',
            mask: true
          })
          let userInfo = wx.getStorageSync('userInfo')
          formData.startAddressInfo = searchObj.startAddress
          formData.endAddressInfo = searchObj.endAddress
          // formData.avatarUrl = this.data.userInfo.avatarUrl
          formData.nickName = userInfo.nickName
          // formData.nickName = this.data.userInfo.nickName
          formData.openid = wx.getStorageSync('openid')
          formData.userid = wx.getStorageSync('userid')
          console.log('处理提交中的formdata', formData)
          wx.request({
            url: config.api_base_url + 'driverPublish/update/' + driverPublish_id,
            method: 'PUT',
            header: {
              'content-type': 'application/json'
            },
            data: {
              formData
            },
            success: (res) => {
              wx.hideLoading()
              _this.setData({
                show: false
              })
              _this.onShow()
            },
            fail: (err) => {
              console.log(err)
              wx.showToast({
                title: '服务器异常',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消修改')
          wx.hideLoading()
        }
      }
    })
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
              address: res.address,
              latitude: res.latitude,
              longitude: res.longitude,
              addressComponent: res2.result.address_component
            }
            _this.setData({
              endAddressInfo: {
                name: res.name,
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude,
                addressComponent: res2.result.address_component
              },
              tmp_end_name: res.name,
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
              // name: res.name,
              // city: res2.result.address_component.city,
              // latitude: res.latitude,
              // longitude: res.longitude
              name: res.name,
              address: res.address,
              latitude: res.latitude,
              longitude: res.longitude,
              addressComponent: res2.result.address_component
            }
            _this.setData({
              startAddressInfo: {
                name: res.name,
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude,
                addressComponent: res2.result.address_component
              },
              tmp_start_name: res.name,
            })
          },
          fail: function (res) {
            console.log('绑定初始位置出差错', res)
          }
        })
      }
    })
  },
});