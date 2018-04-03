//receive data from websocket and pass it to keydown event 
//data should be the keycode pressed

var ws;
let connected = false;
let count = 1;
var keyStates = {}
var generation = 0
var species = 0
var best = -5

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
        if(event.data == ""){
            //don't hit any keys this frame.
        } else if(event.data != "q" && event.data != "w" && event.data != "o" && event.data != "p" && event.data != " ") {
            // click QWOP to begin game
            var element = document.getElementsByTagName('canvas')[0];
            dispatchMouseEvent(element, 'mouseover', true, true);
            dispatchMouseEvent(element, 'mousedown', true, true);
            dispatchMouseEvent(element, 'click', true, true);
            dispatchMouseEvent(element, 'mouseup', true, true);

            //display info about generation
            let infoText = document.getElementById('generation-text');
            let parts = event.data.split(',');
            generation = parseInt(parts[0]);
            species = parseInt(parts[1]);
            infoText.innerText = createText();
            var pageBody = document.getElementById('details');
            pageBody.appendChild(infoText);
        } else {
            let code = getCode(event.data)
            if(event.data == " ") {
                //restarting game because died
                species += 1;
                var infoText = document.getElementById('generation-text');
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
    if(species > 0) {
        return "Generation: " + generation.toString() + "\nSpecies: " + species.toString() + "\nBest This Generation: " + best.toString();
    }
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
        // only send every 3rd frame
        if(count%3==0) {
            //ask for new data from python
            ws.send("newData")
        }
        count += 1
    }
}

function sendEndGameStats(score, time) {
    ws.send(score.toString() + "," + time.toString())
    //also add this data to a table under the details at the top
    let table = document.getElementById('temp-data');
    let newRow = document.createElement('tr');
    let newData1 = document.createElement('td');
    let newData2 = document.createElement('td');
    newData1.innerText = species.toString();
    newData2.innerText = score.toString();
    newRow.appendChild(newData1);
    newRow.appendChild(newData2);
    table.appendChild(newRow);

    //check if best and update
    if(score > best) {
        best = score;
    }

    //now check if a new generation is starting
    if(species == 63) {
        generation += 1;
        species = -1;
        best = -5;
        //delete table rows
        var new_tbody = document.createElement('tbody');
        document.getElementById('temp-data').remove();
        new_tbody.setAttribute('id', 'temp-data');
        var main_table = document.getElementsByTagName('table')[0];
        main_table.appendChild(new_tbody);
    }
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

//Thanks to John Dettmar from SO.
//This code can be viewed here: https://stackoverflow.com/questions/3387427/remove-element-by-id

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}