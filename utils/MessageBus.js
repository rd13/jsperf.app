class Broker {
  constructor(bus, id) {
    this.bus = bus
    this.id = id
  }
  
  emit(...args) {
    return this.bus.emit(this, ...args)
  }

  on(...args) {
    return this.bus.on(this, ...args)
  }
  
  once(...args) {
    return this.bus.once(this, ...args)
  }
  
  register(...args) {
    return this.bus.register(this, ...args)
  }
}

class MessageBus {
  constructor() {
    this.listeners = {}
  }
  
  broker(id) {
    return new Broker(this, id)
  }
  
  // creates an event that can be triggered any number of times
  on(broker, eventName, callback) {
    this.register(broker, eventName, callback);
  }

  // creates an event that can be triggered only once
  once(broker, eventName, callback) {
    this.register(broker, eventName, callback, true);
  }

  // kill an event listener
  off(eventName) {
    delete this.listeners[eventName];
  }

  // removes the given callback for the given event
  detach(eventName, callback) {
    let listeners = this.listeners[eventName] || [];

    listeners = listeners.filter(function (value) {
      return value.callback !== callback;
    });

    if (eventName in this.listeners) {
      this.listeners[eventName] = listeners;
    }
  }

  emit(broker, eventName, ...args) {
    let listeners = [];

    if (this.hasListeners(eventName)) {
      listeners = this.listeners[eventName];
    }

    listeners.forEach((listener, k) => {
      let callback = listener.callback;

      callback(...args)
      
      if (listener.once) {
        this.listeners[eventName].splice(k, 1);
      }
    });
  }

  register(broker, eventName, callback, once = false) {
    if (!this.hasListeners(eventName)) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push({ callback, broker, once });
  }

  hasListeners(eventName) {
    return eventName in this.listeners;
  }
}

export default new MessageBus()
