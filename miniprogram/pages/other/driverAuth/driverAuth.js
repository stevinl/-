// pages/other/driverAuth/driverAuth.js
const {
  config
} = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    form: {},
    canChange: false, //审核状态中就不能更改
    status: '',
    driverNeedAuth: true,
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('执行onload')
    this.getDetail()


  },

  getDetail: function () {
    let _this = this
    let driver = wx.getStorageSync('driver')
    let user = wx.getStorageSync('userid')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.api_base_url + 'driverAuth/finddriver/' + user,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.ret_data.driver_list) {
          console.log(res.data.ret_data.driver_list)
          let driver_list = res.data.ret_data.driver_list
          let status = res.data.ret_data.driver_list.status
          let picList = driver_list.driver_license.split(',')
          _this.setData({
            driverNeedAuth: false,
            driverName: driver_list.driver_name,
            driverPhone: driver_list.phone_number,
            driverCarType: driver_list.car_type,
            driverCarNum: driver_list.plate_number,
            driverIDcard: driver_list.id_card,
            canChange: status === 2 ? false : true,
            status,
            picList,
            form: res.data.ret_data.driver_list
          })

        }else{
          _this.setData({
            driverNeedAuth: true
          })
        }
        wx.hideLoading({})

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
    this.getDetail()
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  ViewImage2(e) {
    wx.previewImage({
      urls: this.data.picList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '您好！',
      content: '确定要删除这张照片？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  startAuth: function () {
    let _this = this
    // console.log(this.data.form)
    let fileIds = []
    let promiseArr = []
    wx.showLoading({
      title: '上传中...',
    })
    for (let i = 0, len = this.data.imgList.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.imgList[i]
        let suffix = /\.\w+$/.exec(item)[0]

        wx.cloud.uploadFile({
          cloudPath: 'STUcarpool/driverAuth' + Date.now() + '-' + Math.random() * 1000000 + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            fileIds = fileIds.concat(res.fileID)
            // console.log(fileIds)
            resolve()
          },
          fail: (err) => {
            console.error
            reject()
          }
        })

      })
      promiseArr.push(p)
    }


    Promise.all(promiseArr).then((res) => {
      // console.log(fileIds)
      _this.data.form.fileIds = fileIds.toString()
      _this.data.form.user_id = wx.getStorageSync('userid')
      console.log(_this.data.form)
      wx.request({
        url: config.api_base_url + 'driverAuth/add',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          form: _this.data.form
        },
        success: (res) => {
          if (res.data.code != 400) {
            console.log(res.data)
            wx.setStorageSync('driverid', res.data.ret_data.driver_id)
            wx.hideLoading()
            wx.showToast({
              title: '成功！等待审核',
            })
            _this.setData({
              driverNeedAuth: false,
              driverName: res.data.ret_data.driver_name,
              driverPhone: res.data.ret_data.phone_number,
              driverCarType: res.data.ret_data.car_type,
              driverCarNum: res.data.ret_data.plate_number,
              driverIDcard: res.data.ret_data.id_card
            })
            this.onLoad()
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '失败！未知原因',
            })
          }

        },
        fail: (err) => {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '失败！出现未知情况',
          })
        }
      })
    })



  },
  changeInfo: function (e) {
    this.setData({
      show:true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  // 订单拥有人修改订单信息。
  submitForm: function (e) {
    let _this = this
    console.log(e.detail)
    // console.log('searchObj:', searchObj)
    let formData = e.detail.value
    let driver_id = this.data.form.driver_id
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
          console.log('处理提交中的formdata', formData)
          wx.request({
            url: config.api_base_url + 'driverAuth/update/' + driver_id,
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
  appeal: function () {

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

  },
  //    input 数据绑定
  realnameInput: function (e) {
    this.data.form.realname = e.detail.value
  },

  phoneInput: function (e) {
    this.data.form.phone = e.detail.value
  },

  cartypeInput: function (e) {
    this.data.form.cartype = e.detail.value
  },

  carnumInput: function (e) {
    this.data.form.carnum = e.detail.value
  },

  idnumInput: function (e) {
    this.data.form.idnum = e.detail.value
  }

})