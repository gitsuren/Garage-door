var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// This is for testing against dummy interface module
var door = require('./door/garage_door_driver_dummy'); // Comment out when running on rapberry
//var door = require('./door/garage_door_driver'); // Comment out when NOT running on rapberrypi


door.registerStatusCB(statusCB);

var PORT = 3000;
var CLIENTS = 0;
var DOORSTATUS = 'unknown';
var VALID_IMEIS = [
    "000000000000000",
    "999888777666555"];
var VALID_CODE = '00000';  // numerical code to open the door

var STATUSRESPONSES = []; // Array to store response objects

app.configure(function(){
  app.use('/css', express.static(__dirname + '/app/css'));
  app.use('/js', express.static(__dirname + '/app/js'));
  app.use('/fonts', express.static(__dirname + '/app/fonts'));
  app.use('/partials', express.static(__dirname + '/app/partials'));
  app.use('/lib', express.static(__dirname + '/app/lib'));
  app.use('/img', express.static(__dirname + '/app/img'));
  app.use(express.json());
});

server.listen(PORT);
console.log('Server running at http://127.0.0.1:' + PORT);
console.log(__dirname);

//////////////////////////////////////////
// HANDLERS
//////////////////////////////////////////

// index handler
app.get('/', function(req, res) {
    res.sendfile('./app/index.html');
});

// Door status query ////////////////////////////////////
app.post('/api/v1/door/status', function (req, res){
  // console.log("POST status: ");
  // console.log(req.body);
  var IMEI = req.body.IMEI;
  var keycode = req.body.keycode;
  var response = {};

  if (validCodes(IMEI, VALID_CODE)){
    DOORSTATUS = door.getStatus();
    // console.log("DOORSTATUS:");
    // console.log(DOORSTATUS);
    //
    response.doorstatus = DOORSTATUS;
    response.response = 'ok'
  } else{
    response.doorstatus = 'unknown';
    response.response = '*DENIED*'
  }
    // console.log(response);
  return res.send(response);
});

// Socket IO for door status  ////////////////////////////////////
io.set('log level', 1);
io.sockets.on('connection', function (socket){
  CLIENTS++;
  console.log("socket opened: " + CLIENTS);
  var doorStatus = door.getStatus();
  io.sockets.emit('doorStatus', doorStatus);

  socket.on('disconnect', function () {
    CLIENTS--;
    console.log("socket closed: " + CLIENTS);
  });
});




// Door: turn switch to open or close //////////////////////////////////////
app.post('/api/v1/door/switch', function (req, res){
  // console.log("POST switch: ");
  // console.log(req.body);
  var IMEI = req.body.IMEI;
  var keycode = req.body.keycode;
  var response = {};

  if (validCodes(IMEI, keycode)){
    // GPIO code to open/close the door and read the physical status
    door.applySwitch();
    response.response = 'ok'
  } else{
    response.response = '*DENIED*'
  }
    // console.log(response);
  return res.send(response);
});


//////////////////////////////////////////
// HELPERS
//////////////////////////////////////////
function validCodes(IMEI, code){
    for(i=0; i < VALID_IMEIS.length; i++){
        if (IMEI == VALID_IMEIS[i])
            if (code == VALID_CODE)
                return true;
            else
                return false;
    }
    return false;
}

// sends the new door status to all registered requests
function statusCB(){
  var doorStatus = door.getStatus();
  // console.log("CB called: status: " + doorStatus);
  io.sockets.emit('doorStatus', doorStatus);
}

