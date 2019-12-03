const rp = require('request-promise');
const cheerio = require('cheerio');

const baseUrl = 'https://detail.damai.cn'
exports.main = async (event, context) => {
  const { id, name } = event
  return rp(`${baseUrl}/item.htm?id=${id}&clicktitle=${encodeURI(name)}`)
    .then((html) => {
      console.log('html', html)
      const $ = cheerio.load(html)
      const detailHtml = $('#detail').find('.words').html(); //.replace(/\s/g, '')
      return detailHtml
    }).catch((err) => {
      console.log(err)
    });
}