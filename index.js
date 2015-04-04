var through = require('through')

function ChromeRuntimeStream(port) {
  var stream = through(function write(data) {
    port.postMessage(data)
  },
  function end() {
    stream.queue(null)
  })

  port.onMessage.addListener(function (msg) {
    stream.queue(msg)
  })

  port.onDisconnect.addListener(function () {
    stream.queue(null)
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
