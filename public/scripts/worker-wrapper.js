function WorkerWrapper (file) {
    this.worker = new Worker(file);
    this.callbacks = {};

    this.worker.onmessage = this._observer.bind(this);
}

WorkerWrapper.prototype._observer = function(message) {
    if (typeof message !== 'object' || typeof message.data.name === 'undefined' || typeof message.data.data === 'undefined') {
        throw 'Improper format of worker message.\n' + JSON.stringify(message);
    }

    if (message.data.name in this.callbacks) {
        this.callbacks[message.data.name](message.data.data);
    } else {
        throw 'No handler for event ' + message.data.name;
    }
}

WorkerWrapper.prototype.on = function(event, handler) {
    this.callbacks[event] = handler;
}

WorkerWrapper.prototype.emit = function(event, data) {
    this.worker.postMessage({ name: event, data: data });
}






function RenameMe () {
    onmessage = this._observer.bind(this);
    this.callbacks = {};
}

RenameMe.prototype.on = function(event, handler) {
    this.callbacks[event] = handler;
}

RenameMe.prototype.emit = function(event, data) {
    postMessage({ name: event, data: data });
}

RenameMe.prototype._observer = function(message) {
    if (typeof message !== 'object' || typeof message.data.name === 'undefined' || typeof message.data.data === 'undefined') {
        throw 'Improper format of worker message in worker.\n' + JSON.stringify(message);
    }

    if (message.data.name in this.callbacks) {
        this.callbacks[message.data.name](message.data.data);
    } else {
        throw 'No handler for event ' + message.data.name;
    }
}

