// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  /** 查询列表 */
  app.router('list', async (ctx, next) => {
    const list = require('./list.js')
    ctx.body = list.main(event, context)
  })
  /** 查询详情 */
  app.router('detail', async (ctx, next) => {
    const detail = require('./detail.js')
    ctx.body = detail.main(event, context)
  })
  return app.serve();
}