
var RESPONSECB;

function getStatus(){
    // return random door status
    var val = ["open", "moving", "closed"]
    var i = Math.floor(Math.random() * 3)
    console.log("the door is: " + val[i]);
    return val[i];
}

function registerStatusCB(callback){
    RESPONSECB = callback;
    console.log("CB set");
}

// clicks the switch
function applySwitch(){
    // doorSwitch.writeSync(1); // press
    console.log("pressed");
    setTimeout(function() {
        // doorSwitch.writeSync(0); // release
        console.log("released");
    }, 4000);
}


module.exports = {
    getStatus: getStatus,
    registerStatusCB: registerStatusCB,
    applySwitch: applySwitch
};

