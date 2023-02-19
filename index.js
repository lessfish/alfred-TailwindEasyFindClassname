const data = require('./menu.json')
const keyword = process.argv[2].toLowerCase()

// console.warn('keyword', process.argv);

const res = []

data.forEach(item => {
  const { name } = item;

  // 根据关键字过滤筛选
  if (!name.toLocaleLowerCase().includes(keyword)) return;

  res.push({
    title: name,
    arg: name,
  })
})

console.log(JSON.stringify({ items: res }));