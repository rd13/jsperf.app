// A simple message broker wrapping the postMessage API

export default class PostMessageBroker {
  constructor(destination = window.top) {
    this.subscriptions = []
    this.destination = destination

    this.messages = []
  }
  emit(message, payload = {}) {
    this.destination.postMessage({
      error: false,
      message,
      ...payload
    }, '*');
  }
  register(message, callback) {
    window.addEventListener('message', event => {
      event.data.message && event.data.message === message && callback(event)
    })
  }
}
