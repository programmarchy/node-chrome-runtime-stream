var through = require('through2')

function ChromeRuntimeStream(port) {
  var stream = through.obj(function (msg, enc, next) {
    port.postMessage(msg)
    next()
  },
  function (done) {
    port.disconnect()
    done()
  })

  port.onMessage.addListener(function (msg) {
    stream.push(msg)
  })

  port.onDisconnect.addListener(function () {
    stream.end()
  })

  return stream
}

module.exports = ChromeRuntimeStream

module.exports.detectCompatibility = function (callback) {
  if (!chrome) {
    callback && callback(new Error('Chrome browser not detected.'))
    return false
  } else if (!chrome.runtime) {
    callback && callback(new Error('Chrome runtime not detected.'))
    return false
  } else if (!typeof chrome.runtime.connect === 'function') {
    callback && callback(new Error('Chrome version 26 or higher not detected.'))
    return false
  } else {
    callback && callback(null)
    return true
  }
}
