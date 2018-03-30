//receive data from websocket and pass it to keydown event 
//data should be the keycode pressed

var ws = new WebSocket("ws://localhost:8099/")

ws.onopen = function () {
    console.log("Opened web socket.")
}

ws.onmessage = function (event) {
    //simulateKeyboardEvent(event.data);
    console.log(event.data)
}

function simulateKeyboardEvent(character) {
    var keyBoardEvent = document.createEvent('KeyboardEvent');
    var initMethod = typeof keyBoardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

    keyBoardEvent[initMethod](
        "keydown",
        true,
        true, 
        window,
        false,
        false, 
        false,
        false,
        character,
        0 //unicode ky if required (shouldn't be)
    );
    document.dispatchEvent(keyBoardEvent);
}