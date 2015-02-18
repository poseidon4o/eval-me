var express = require('express'),
    path = require('path');

var app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index');
});


app.listen(80);