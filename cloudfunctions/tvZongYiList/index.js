// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise');
const type = 'tv'
const tag = encodeURI('综艺')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('start ==>', event.start)
  console.log('limit ==>', event.limit)
  const options = {
    uri: `https://movie.douban.com/j/search_subjects?type=${type}&tag=${tag}&page_limit=${event.limit}&page_start=${event.start}`,
    headers: {
      'Host': 'movie.douban.com',
      'Referer': 'https://movie.douban.com/'
    },
    json: true
  }
  return rp(options)
    .then(function (res) {
      console.log('res==>', res)
      return res;
    })
    .catch(function (err) {
      console.log(err)
    });
}