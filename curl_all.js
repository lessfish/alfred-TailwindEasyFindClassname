const cheerio = require('cheerio')
const async = require('async')
const fetch = require('node-fetch')

let index = 1

// 抓取网页内容
function fetchUrl(target, callback) {
  const { href, name } = target

  const idx = index++
  console.log(`第 ${idx} 个开始抓取 ...`);

  fetch(href, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET"
  }).then(res => res.text())
    .then(html => {
      const $ = cheerio.load(html)
      const ans = []

      $('table tbody').eq(0).children('tr').each(function (index, item) {
        const $item = $(item)
        const tds = $item.children('td')
        const className = $(tds[0]).text().trim();
        // workflow 中显示内容只能显示一行，\n 后的内容无法显示
        const detail = $(tds[1]).text().trim().replace(/\n/g, ' ')

        ans.push({
          className, // tailwind 中的类名
          detail, // 该类型表示的实际样式
        })
      })

      console.log(`第 ${idx} 个抓取结束`);
      callback(null, {
        name,
        list: ans
      });
    })
}

// 目前筛选后共 52 条数据
const targets = require('./menu.json');

// 并发量控制为 5
// 对每个元素执行第三个回调
// 全部执行完后执行第四个回调
async.mapLimit(targets, 5, function (item, callback) {
  fetchUrl(item, callback);
}, function (err, result) {
  console.log('---抓取成功---')
  require('fs').writeFileSync('class-list.json', JSON.stringify(result))
});