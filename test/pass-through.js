var exec = require('../index').exec,
    test = require('tap').test,
    xtest = function () {}

test('exec - plain', function (t) {
  var child

  t.plan(2)

  child = exec('../squawker 200 100', 
    function (err, stdout, stderr) {
      t.equal(stdout, 'squawk!\nsquawk!\n')
      t.equal(stderr, '')
    })
})

test('exec - addListener', function (t) {
  var child,
      buf = []

  t.plan(3)

  child = exec('../squawker 200 100',
    function (err, stdout, stderr) {
      t.equal(stdout, 'squawk!\nsquawk!\n')
      t.equal(buf.join(''), 'squawk!\nsquawk!\n')
      t.equal(stderr, '')
    })

  child.stdout.addListener('data', 
    function (data) {
      buf.push(data)
    })
})

test('exec - timeout', function (t) {
  var child,
      SIGTERM_RET_CODE = 143

  t.plan(3)

  child = exec('../squawker 4000 100',
    {timeout: 150},
    function (err, stdout, stderr) {
      t.equal(stdout, 'squawk!\n')
      t.equal(stderr, '')
      t.equal(err.code, SIGTERM_RET_CODE)
    })
})
