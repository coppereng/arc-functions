let test = require('tape')
let transform = require('../../src/proxy/transform')

test('env', t=> {
  t.plan(1)
  t.ok(transform, 'transform')
  console.log(transform)
})

test('transform returns early if there are no plugins', t=> {
  t.plan(2)
  let headers = {}
  let body = `let foo = 1`
  let result = transform({
    Key:'foo.mjs',
    config: {},
    defaults: {headers, body},
  }) 
  t.ok(result.body === body, 'body')
  t.ok(JSON.stringify(result.headers) === JSON.stringify(headers), 'headers')
})

function plugin0(key, {headers, body}, config) {
  body = JSON.parse(body)
  body.zero = true
  return {headers, body: JSON.stringify(body)}
}
function plugin1(key, {headers, body}, config) {
  body = JSON.parse(body)
  body.one = true
  return {headers, body: JSON.stringify(body)}
}
function plugin2(key, {headers, body}, config) {
  body = JSON.parse(body)
  body.two = true
  return {headers, body: JSON.stringify(body)}
}

test('transforms', t=> {
  t.plan(4)
  let headers = {}
  let body = JSON.stringify({})
  let result = transform({
    Key: 'foo.json',
    config: {
      plugins: {
        json: [plugin0, plugin1, plugin2],
      }
    },
    defaults: {headers, body},
  }) 
  let parsed = JSON.parse(result.body)
  t.ok(parsed, 'body')
  t.ok(parsed.zero, 'zero')
  t.ok(parsed.one, 'one')
  t.ok(parsed.two, 'two')
  console.log(parsed)
})
