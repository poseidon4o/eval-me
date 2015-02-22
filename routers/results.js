var router = require('express').Router(),
    models = require('../models/jobs.js'),
    mongoose = require('mongoose');

// base = /api/results

router.get('/:limit?', function(req, res) {
    models.job.find({ done: true }).limit(req.params.limit || 10).exec(function(err, result) {
        if (!err) {
            res.json(result.map(function(result) {
                return {
                    data: result.data,
                    result: result.result
                };
            }));
        } else {
            res.status(500).end('Failed to get results')
            console.log(err);
        }
        res.end();
    });
});


module.exports = router;