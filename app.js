var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/bower_components", express.static(path.join(__dirname, 'bower_components')));

app.get('/', function(req, res) {
    res.render('index');
});

app.use('/api/jobs', require('./routers/jobs.js'));
app.use('/api/results', require('./routers/results.js'));

app.get('/jobs', function(req, res) {
    res.render('jobs');
});

app.get('/results', function(req, res) {
    res.render('results');
});


app.listen(80);