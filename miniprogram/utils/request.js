/**
 * @class HTTP
 */

const { config } = require('../config')

const error_msgs = {
  1: '抱歉 出现错误',
  1001: 'err_msg测试1',
  1002: 'err_msg测试2',
  1003: 'err_msg测试3'
}

class HTTP {

  request(params) {
    if(!params.method) {
      params.method = "GET"
    }

    wx.request({
      url: config.api_base_url + params.url,
      method: params.method,
      data: params.data,
      header: {
        'content-type':'application/json'
      },
      success: (res )=> {
        let code = res.statusCode.toString()
        if (code.startsWith('2')){
          params.success && params.success(res.data)  // 暴露参数出去
        }
        else{ 
          let error_code = res.data.error_code
          this._show_error(error_code)
        }

      },
      fail: (err)=> {
        this._show_error(1)
      }
    })
  }

  _show_error(error_code){
    wx.showToast({
      title: error_msgs[error_code],
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }

}


module.exports = {
  HTTP
}


//使用方法:

// ***.request({
//   url: 'auth/token',
//   success:(res)=>{
//     console.log(res)
//   }
// })