var exec = require('../index').exec,
    test = require('tap').test,
    xtest = function () {}

function repeat(str, count) {
  var buf = []
  for (var i = 0; i < count; i++) {
    buf.push(str)
  }
  return buf.join('')
}

test('exec - rolling timeout slowed', function (t) {
  var child,
      timeout = false,
      SIGTERM_RET_CODE = 143

  t.plan(4)

  // 2 squawks, then timeout due to no activity
  child = exec('../squawker 1000 100 100',
    {rollingTimeout: 200},
    function (err, stdout, stderr) {
      t.equal(timeout, true, 'rolling-timeout emit')
      t.equal(err.code, SIGTERM_RET_CODE)
      t.equal(stdout, repeat('squawk!\n', 2))
      t.equal(stderr, '')
    })
  child.on('rolling-timeout', function () {
    timeout = true
  })
})

test('exec - rolling success', function (t) {
  var child

  t.plan(1)

  // no timeout, child exits on its own
  child = exec('../squawker 400 100',
    {rollingTimeout: 200},
    function (err, stdout, stderr) {
      t.equal(stdout, repeat('squawk!\n', 4))
    })
})

test('exec - rolling timeout', function (t) {
  var child,
      timeout = false,
      SIGTERM_RET_CODE = 143

  t.plan(4)

  // time's out before anything is squawked
  child = exec('../squawker 5000 1000',
    {rollingTimeout: 200},
    function (err, stdout, stderr) {
      t.equal(timeout, true, 'rolling-timeout emit')
      t.equal(stdout, '')
      t.equal(stderr, '')
      t.equal(err.code, SIGTERM_RET_CODE)
    })
  child.on('rolling-timeout', function () {
    timeout = true
  })
})

