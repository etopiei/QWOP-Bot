//receive data from websocket and pass it to keydown event 
//data should be the keycode pressed

var ws;
let connected = false;
let count = 1;
var keyStates = {}
var generation = 0
var species = 0

window.onkeyup = function(e) { keyStates[e.keyCode] = false; }
window.onkeydown = function(e) { keyStates[e.keyCode] = true; }

function qwopLoaded() {
    ws = new WebSocket("ws://localhost:8099/")

    ws.onopen = function () {
        console.log("Opened web socket.")
        connected = true;
    }
    ws.onmessage = function (event) {
        console.log(event.data)
        if(event.data != "q" && event.data != "w" && event.data != "o" && event.data != "p" && event.data != " ") {
            // click QWOP to begin game
            var element = document.getElementsByTagName('canvas')[0];
            dispatchMouseEvent(element, 'mouseover', true, true);
            dispatchMouseEvent(element, 'mousedown', true, true);
            dispatchMouseEvent(element, 'click', true, true);
            dispatchMouseEvent(element, 'mouseup', true, true);

            //display info about generation
            let infoText = document.createElement('p');
            let parts = event.data.split(',');
            generation = parseInt(parts[0]);
            species = parseInt(parts[1]);
            infoText.innerText = createText();
            infoText.style.position = "absolute";
            infoText.style.top = "0";
            infoText.style.right = "10";
            var pageBody = document.getElementsByTagName('body')[0];
            pageBody.appendChild(infoText);

        } else {
            let code = getCode(event.data)
            if(event.data == " ") {
                //restarting game because died
                species += 1;
                var infoText = document.getElementsByTagName('p')[0];
                infoText.innerText = createText();
                simulateKeydown(code);
                simulateKeyup(code);
            } else {
                // treat message as key being toggled
                if(keyStates[code]) {
                    //key is down, make key-up event
                    simulateKeyup(code);
                } else {
                    //key is up, press it down
                    simulateKeydown(code);
                }
            }
        }
    }
}

function createText() {
    return "Generation: " + generation.toString() + "\nSpecies: " + species.toString();
}

function getCode(keyChar) {
    if(keyChar == 'q') {
        return 81;
    } else if (keyChar == 'w') {
        return 87;
    } else if (keyChar == 'o') {
        return 79;
    } else if (keyChar == 'p') {
        return 80;
    } else {
        return 32
    }
}

function sendGameStats(data) {
    if(connected) {
        // send stats from update function, this is called every frame so
        // only send every 10th frame 
        if(count%10==0) {
            //convert data to Python NEAT inputs
            //ws.send(data)
            ws.send("newData")
        }
        count += 1
    }
}

function sendEndGameStats(score, time) {
    ws.send(score.toString() + ", " + time.toString())
}

var dispatchMouseEvent = function(target, var_args) {
    var e = document.createEvent("MouseEvents");
    // If you need clientX, clientY, etc., you can call
    // initMouseEvent instead of initEvent
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
  };

function simulateKeydown (keycode,isCtrl,isAlt,isShift){
    var e = new KeyboardEvent( "keydown", { bubbles:true, cancelable:true, char:String.fromCharCode(keycode), key:String.fromCharCode(keycode), shiftKey:isShift, ctrlKey:isCtrl, altKey:isAlt } );
    Object.defineProperty(e, 'keyCode', {get : function() { return this.keyCodeVal; } });     
    e.keyCodeVal = keycode;
    document.dispatchEvent(e);
}

function simulateKeyup (keycode,isCtrl,isAlt,isShift){
    var e = new KeyboardEvent( "keyup", { bubbles:true, cancelable:true, char:String.fromCharCode(keycode), key:String.fromCharCode(keycode), shiftKey:isShift, ctrlKey:isCtrl, altKey:isAlt } );
    Object.defineProperty(e, 'keyCode', {get : function() { return this.keyCodeVal; } });     
    e.keyCodeVal = keycode;
    document.dispatchEvent(e);
}