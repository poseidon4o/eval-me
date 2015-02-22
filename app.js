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

app.use('/api', require('./routers/api.js'));
app.get('/jobs', function(req, res) {
    res.render('jobs');
});


app.listen(80);