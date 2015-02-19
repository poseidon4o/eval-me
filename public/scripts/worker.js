importScripts('worker-wrapper.js');

var self = new RenameMe();
var settings = {
    result: null,
    error: false,
    busy: false
};

self.on('init', function(id) {
    settings.id = id;
    self.emit('state-change', settings.busy);
});

self.on('work', function(data) {
    try {
        self.emit('state-change', true);
        settings.busy = true;
        settings.result = eval(data);
        settings.error = false;
    } catch (e) {
        settings.error = e;
    }

    settings.busy = false;
    self.emit('result', { result: settings.result, error: settings.error });
    self.emit('state-change', false);
});