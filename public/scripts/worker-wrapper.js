/**
 * Provides base event based IO
 */
function EventIO () {
    this.callbacks = {};
}

EventIO.prototype._observer = function(message) {
    if (typeof message !== 'object' || typeof message.data.name === 'undefined' || typeof message.data.data === 'undefined') {
        throw 'Improper format of worker message.\n' + JSON.stringify(message);
    }

    if (message.data.name in this.callbacks) {
        this.callbacks[message.data.name](message.data.data);
    } else {
        throw 'No handler for event ' + message.data.name;
    }
}

EventIO.prototype.on = function(event, handler) {
    if (handler === null && event in this.callbacks) {
        delete this.callbacks[event];
    } else {
        this.callbacks[event] = handler;
    }
}



/**
 * Provides client interface for using web workers
 * @param {String} file Worker js file
 */
function WorkerWrapper (file) {
    EventIO.call(this);
    this.worker = new Worker(file);

    this.worker.onmessage = this._observer.bind(this);
}

WorkerWrapper.prototype = Object.create(EventIO.prototype);
WorkerWrapper.prototype.constructor = WorkerWrapper;

WorkerWrapper.prototype.emit = function(event, data) {
    this.worker.postMessage({ name: event, data: data });
}

WorkerWrapper.prototype.terminate = function() {
    this.worker.terminate();
};

/**
 * Provides 'inside' web worker interface to communicate with WorkerWrapper
 */
function RenameMe () {
    EventIO.call(this);
    onmessage = this._observer.bind(this);
    this.callbacks = {};
}

RenameMe.prototype = Object.create(EventIO.prototype);
RenameMe.prototype.constructor = RenameMe;

RenameMe.prototype.emit = function(event, data) {
    postMessage({ name: event, data: data });
}
