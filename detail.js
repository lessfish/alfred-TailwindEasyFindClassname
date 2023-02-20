const [, , name, keyword] = process.argv
const list = require('./class-list.json').find(item => item.name === name)?.list || []

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
