// run the following commands to get access to the pins
// pi@raspberrypi ~/Dev/garage $ gpio-admin export 17
// pi@raspberrypi ~/Dev/garage $ gpio-admin export 18
// pi@raspberrypi ~/Dev/garage $ gpio-admin export 22



var Gpio = require('onoff').Gpio,       // Constructor function for Gpio objects.
    doorIsOpen = new Gpio(17, 'in','both'),     // Export GPIO #17 as both.
    doorIsClosed = new Gpio(18, 'in', 'both'),  // Export GPIO #18 as both.
    doorSwitch = new Gpio(22, 'out');           // Export GPIO #22 as an output.

// doorSwitch.writeSync(1); // init realy

var RESPONSECB;

doorIsOpen.watch(function(err, value) {
    // console.log("change");
    if (RESPONSECB != 'undefined'){
        RESPONSECB();
    }
});

doorIsClosed.watch(function(err, value) {
    // console.log("change");
    if (RESPONSECB != 'undefined'){
        RESPONSECB();
    }
});



function getStatus(){
    var openSensor = doorIsOpen.readSync();
    var closedSensor = doorIsClosed.readSync()
    //console.log('opensensor: ' + openSensor)
    //console.log('closedsensor: ' + closedSensor)
    if (openSensor == 1 && closedSensor == 0)
        return "open";
    else if (openSensor == 0 && closedSensor == 1)
        return "closed";
    else
        return "moving";
}


function registerStatusCB(callback){
    RESPONSECB = callback;
    console.log("CB set");
}


// clicks the switch
function applySwitch(){
    doorSwitch.writeSync(1); // press
    console.log("pressed");
    setTimeout(function() {
        doorSwitch.writeSync(0); // release
        console.log("released");
    }, 4000);
}


module.exports = {
    getStatus: getStatus,
    registerStatusCB: registerStatusCB,
    applySwitch: applySwitch
};

