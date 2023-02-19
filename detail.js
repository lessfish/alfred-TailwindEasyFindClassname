const [name, keyword] = process.argv[2].split(' ')
const originName = name.split('\t').join(' ') // 因为之前用 \t 给 join 成一个字符串了，不然 keyword 不好拆分
const list = require('./class-list.json').find(item => item.name === originName)?.list || []

const res = []

list.forEach(item => {
  const { className, detail } = item

  if (keyword && !className.includes(keyword) && !detail.includes(keyword)) return

  res.push({
    title: `${className} -> (${detail})`,
    arg: className,
  })
})

console.log(JSON.stringify({ items: res }));