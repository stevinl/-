// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      page: 'miniprogram/pages/expore/expore', //要跳转到那个小程序页面
      data: { //推送的内容
        thing1: {
          value: '小程序入门课程'
        },
        character_string2: {
          value: '4'
        },
        character_string3: {
          value: '2'
        },
        phone_number4: {
          value: '1234123412'
        }
      },
      templateId: 'Az3FYgrZm5uu6jNNoI0KIyy7Xlif7Q2GO7Uh2Yj4F2E' //模板id
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}