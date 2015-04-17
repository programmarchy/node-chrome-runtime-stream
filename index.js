var through = require('through2')

function ChromeRuntimeStream(port) {
  var connected = true

  var stream = through.obj(function (msg, enc, next) {
    if (connected) {
      port.postMessage(msg)
    }
    next()
  },
  function flush(done) {
    if (connected) {
      removeListeners()
      connected = false
      port.disconnect()
    }
    done()
  })

  addListeners()

  function onMessage(msg) {
    stream.push(msg)
  }

  function onDisconnect() {
    removeListeners()
    connected = false
    stream.end()
  }

  function addListeners() {
    port.onMessage.addListener(onMessage)
    port.onDisconnect.addListener(onDisconnect)
  }

  function removeListeners() {
    port.onMessage.removeListener(onMessage)
    port.onDisconnect.removeListener(onDisconnect)
  }

  return stream
}

module.exports = ChromeRuntimeStream
