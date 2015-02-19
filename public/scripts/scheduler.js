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
        this.workers.push({
            id: c,
            worker: null,
            busy: true 
        });
    }

    // this will terminate the worker upon result/error
    // it ensures there are no left over state or resources
    this.recreate_on_done = false;
}

Scheduler.prototype._make_worker = function(idx) {
    this.workers[idx].worker = new WorkerWrapper('public/scripts/worker.js');
    worker.on('state-change', this._state_change.bind(this, idx));
    worker.emit('init', idx);
};

Scheduler.prototype._state_change = function(id, state) {
    console.log(id, 'busy', state);
    this.workers[id].busy = state;
}

Scheduler.prototype.eval = function(data, callback) {
    for (var c = 0; c < this.workers.length; ++c) {
        if (!this.workers[c].busy) {
            this._state_change(c, true);
            
            this.workers[c].worker.on('result', function(response) {
                // detach callback so we dont called second time
                this.workers[c].worker.on('result', null);

                callback(response.result, response.error);

                if (this.recreate_on_done) {
                    this.workers[c].worker.terminate();
                    this._make_worker(c);
                }
            }.bind(this));

            this.workers[c].worker.emit('work', '(' + data + ')()');
            return;
        }
    }
    throw 'No available workers';
}
