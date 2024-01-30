// components/tripMsg/tripMsg.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    showType: {
      type: Number,
      title: '类型'
    },
    userObj: {
      type: Object,
      title: '用户信息'
    },
    courseObj: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGoDetail: function (e){
      let courseObj = e.currentTarget.dataset.courseobj
      console.log(courseObj)
      wx.navigateTo({
        // url: '../../pages/driverPublishDetail/driverPublishDetail?course=' + JSON.stringify(courseObj) + '&showType=' + this.data.showType
        url: '../../../pages/capsule-bar/index?course=' + JSON.stringify(courseObj) + '&showType=' + this.data.showType
      })
    }
  }
})
