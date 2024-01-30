const { HTTP } = require('../utils/request')

class Classic extends HTTP {
  //getLatest需要接受一个回调函数
  getLatest(callBack) {
    this.request({
      url: 'classic/get',
      success:(res)=>{
        callBack(res)
      }
    })
  }
}

module.exports = {
  Classic
}


// 使用方法
// Classic.getLatest((res)=> {
//   this.setData({
//     data: res
//   })
// })