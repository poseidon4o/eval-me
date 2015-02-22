var router = require('express').Router(),
    models = require('../models/jobs.js'),
    mongoose = require('mongoose');


router.get('/results', function(req, res) {
    models.job.find({ done: true }, function(err, result) {
        if (!err) {
            console.log(result);
            res.json(result);
        } else {
            console.log(err);
        }
        res.end();
    });
});

router.get('/jobs/:limit?', function(req, res) {
    models.job.find({ done: false }).limit(req.params.limit || 10).exec(function(err, result) {
        if (!err) {
            console.log(result);
            res.json(result);
        } else {
            console.log(err);
        }
        res.end();
    });
});

router.put('/jobs', function(req, res) {
    models.job.create({
        data: req.body.data
    }, function(err, job) {
        if (err) {
            res.status(500).end("Failed to create job");
        }
        res.end();
    })
});

router.get('/jobs/:id', function(req, res) {
    models.job.find({ _id: req.params.id }, function(err, result) {
        if (!err) {
            console.log(result);
            res.json(result);
        } else {
            console.log(err);
        }
        res.end();
    });
});

router.post('/jobs/:id', function(req, res) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        models.job.update({ _id: req.params.id, done: false}, { result: req.body.result, done: true }, function(err, updated) {
            console.log(err, updated);
            if (err || !updated) {
                res.status(500).end('Failed to update job');
            } else {
                res.end();
            }
        });
    }
})

module.exports = router;