const { HTTP } = require('../../utils/request')

class PostDriverPublishModel extends HTTP {
  async postData(formData) {
    this.request({
      url: 'driverPublish/add',
      method: 'POST',
      data : {
        formData
      }
    })
  }
}

module.exports = {
  PostDriverPublishModel
}