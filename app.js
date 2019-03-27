var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const fileUpload = require('express-fileupload');



// database setup

// setup database connection

var mysql = require('mysql')


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hiddeneye',
  timezone: 'EST'
});

connection.connect(function(err) {
  if (err) {
      console.error('error connecting: ' + err.stack);
      return;
  }

  console.log('database connected as id ' + connection.threadId);
});

// database setup end

var app = express();

var indexRouter = require('./routes/index');
var server = require('http').Server(app);
var io = require('socket.io')(server);

// 
var tempSensor, lightSensor, Doorsw;
var five = require("johnny-five"); // Load the node library that lets us talk JS to the Arduino
var board = new five.Board(); // Connect to the Arduino using that library

var indexRouter = require('./routes/index');

board.on("ready", function() {
    // setup temperature sensor LM35
    tempSensor = new five.Thermometer({
        controller: 'LM35',
        pin: 'A0',
        threshold: 3,
        freq: 250,
    });

    Doorsw = new five.Switch(7);
    
    Doorsw.on("open", function(){
      var socketopen = "door is open";
       io.emit('door', socketopen);
    });
      
      Doorsw.on("close", function(){
        var socket = "door is close";
        io.emit('door', socket);
    });
        
        // setup light sensor to correct pin
    lightSensor = new five.Sensor({
        pin: 'A1',
        freq: 250
    });

    lightSensor.on("change", function() {
        // console.log("light is " + this.value);
        io.emit('light', this.scaleTo(100,0));
        saveToDatabase('light', this.scaleTo(100,0));
    });

    tempSensor.on("data", function() {
        // console.log("current temprature is " + this.fahrenheit + "F");
        io.emit('temperature', this.fahrenheit);

        saveToDatabase('temperature', this.fahrenheit);
    });

});

function saveToDatabase(type, value) {

  // console.log(type);
  // console.log(value);

  connection.query(`INSERT INTO readings (type, value) VALUES ('${type}', '${value}');`, function(err, rows, fields) {
      if (err) throw err
      var last_inserted_id = rows.insertId;
      return last_inserted_id;
      console.log('Last inserted item id : ', rows.insertId)
  });
}
function ReadingsByHour(type) {

  var sql = `
  SELECT date_format( updated_at, '%Y-%m-%d %h:00 %p' ) as date, date_format( updated_at, '%h:00 %p' ) as hour, ROUND(AVG(value)) as average_value FROM readings WHERE type='${type}' GROUP BY hour( updated_at ) , day( updated_at ) ORDER BY updated_at DESC`;
  
  connection.query(sql, function(err, rows, fields) {
      if (err) throw err
      // console.log(rows);
      return rows;
  });
}
app.get('/history/temperature', function(req, res, next) {

  res.render('history');
});

app.get('/api/temperature/history', function(req, res, next) {


  let type = 'temperature';
  var sql = `
  SELECT date_format( updated_at, '%Y-%m-%d %h:00 %p' ) as date, date_format( updated_at, '%h:00 %p' ) as hour, ROUND(AVG(value)) as average_value FROM readings WHERE type='${type}' GROUP BY HOUR( updated_at ) , DAY( updated_at ) ORDER BY updated_at DESC`;
  
  connection.query(sql, function(err, rows, fields) {
      if (err) throw err

      let resData = [];
      console.log(rows.date);
      for(let i=0; i< rows.length; i++) {
        resData[i] =  {
          date: rows[i].date,
          time: rows[i].hour,
          average: rows[i].average_value
        };       
      }
      console.log(resData);
      return res.json(resData);
  });
})








function optimizeTemp(tempSensor) {
    return tempSensor.fahrenheit;
    return Math.round(tempSensor.fahrenheit - 25)
}
// get light measurement
function optimizeLight(lightSensor) {
    return lightSensor.value;
    return Math.round(lightSensor.value / 1023 * 100)
}


// get random int in range of min and max --> was used to mock out data
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }


// functions end
var flash = require('connect-flash');

app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({secret: 'keyboard cat',resave:true, saveUninitialized:true}))

// app.use(checkAuth);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

  
module.exports = {app: app, server: server}; 
