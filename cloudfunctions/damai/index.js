// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
// const TcbRouter = require('tcb-router')

cloud.init()

const baseUrl = 'https://search.damai.cn/searchajax.html?'
// 云函数入口函数
exports.main = async (event, context) => {
  const { city, category, currPage, pageSize } = event
  const options = {
    uri: `${baseUrl}keyword=&cty=${encodeURI(city)}&ctl=${encodeURI(category)}&sctl=&tsg=0&st=&et=&order=1&pageSize=${pageSize}&currPage=${currPage}&tn=`,
    headers: {
      'Host': 'search.damai.cn'
    },
    json: true
  }
  console.log('url ==>', options.uri)
  return rp(options)
    .then(function (res) {
      return {
        "ctl": res.ctl,
        "cty": res.cty,
        "totalPage": res.pageData.totalPage,
        "list": res.pageData.resultData
      }
    })
    .catch(function (err) {
      console.log(err)
    });
}