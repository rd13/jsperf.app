/**
 * PostMessageBroker
 * A minimal messaging broker wrapping postMessage
 *
 * const broker = new PostMessageBroker()
 * broker.on('event', ({data: {payload}}) => {})
 * broker.emit('event', {payload})
 */
export default class PostMessageBroker {
  constructor(destination = window.top) {

    // where the postMessage will be broadcast
    this.destination = destination

    // each message has an array of callbacks
    this.subscriptions = {
      // message: [callback]
    }

    // fn() is run for each postMessage
    this.fn = (event => {
      event.data.message 
        // check for matching subscriptions
        && this.subscriptions[event.data.message] 
        // run callbacks
        && this.subscriptions[event.data.message].map(callback => callback(event))
    }).bind(this)

    window.addEventListener('message', this.fn, false) 
  }

  // remove event listener
  destroy() {
    window.removeEventListener('message', this.fn, false)
  }

  // send a new message
  emit(message, payload = {}) {
    this.destination.postMessage({
      error: false,
      message,
      ...payload
    }, '*');
  }

  // add a new callback for message
  on(message, callback) {
    this.subscriptions[message] = [...(this.subscriptions[message] || []), callback]
  }

  // remove all callbacks for message
  off(message) {
    delete this.subscriptions[message]
  }
}
