var router = require('express').Router(),
    models = require('../models/jobs.js'),
    mongoose = require('mongoose');

// base = /api/jobs

router.get('/:limit?', function(req, res) {
    models.job.find({ done: false }).limit(req.params.limit || 10).exec(function(err, result) {
        if (!err) {
            res.json(result.map(function(job) {
                return {
                    'id': job._id,
                    'data': job.data
                };
            }));
        } else {
            console.log(err);
        }
        res.end();
    });
});

router.put('/', function(req, res) {
    models.job.create({
        data: req.body.data
    }, function(err, job) {
        if (err) {
            res.status(500).end("Failed to create job");
        }
        res.end();
    })
});

router.post('/:id', function(req, res) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        models.job.update({ _id: req.params.id, done: false}, { result: req.body.result, done: true }, function(err, updated) {
            if (err || !updated) {
                res.status(500).end('Failed to update job');
            } else {
                res.end();
            }
        });
    }
})

module.exports = router;