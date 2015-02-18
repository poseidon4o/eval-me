

/**
 * Provides simple pool of web workers
 * @param {int} workers Number of workers in pool
 */
function Scheduler (workers) {
    if (!window.Worker) {
        throw 'Web Workers not supported!';
    }
    this.workers = [];
    for (var c = 0; c < workers; ++c) {
        var worker = new WorkerWrapper('public/scripts/worker.js');
        this._make_bindings(worker, c);
        this.workers.push({
            id: c,
            worker: worker,
            busy: false 
        });

        worker.emit('init', c);
    }
}

Scheduler.prototype._make_bindings = function(worker, c) {
    worker.on('state-change', this._state_change.bind(this, c));
}

Scheduler.prototype._state_change = function(id, state) {
    console.log(id, 'busy', state);
    this.workers[id].busy = state;
}

Scheduler.prototype.eval = function(data, callback) {
    for (var c = 0; c < this.workers.length; ++c) {
        if (!this.workers[c].busy) {
            this.workers[c].worker.on('result', function(response) {
                callback(response.result, response.error);
            });
            this.workers[c].worker.emit('work', '(' + data + ')()');
        }
    }
}
