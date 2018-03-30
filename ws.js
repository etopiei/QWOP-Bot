//receive data from websocket and pass it to keydown event 
//data should be the keycode pressed

var ws;
let connected = false;

function qwopLoaded() {
    ws = new WebSocket("ws://localhost:8099/")

    ws.onopen = function () {
        console.log("Opened web socket.")
        connected = true;
    }
    ws.onmessage = function (event) {
        console.log(event.data)
        if(event.data == "Connected to server") {
            // click QWOP to begin game
            var element = document.getElementsByTagName('canvas')[0];
            dispatchMouseEvent(element, 'mouseover', true, true);
            dispatchMouseEvent(element, 'mousedown', true, true);
            dispatchMouseEvent(element, 'click', true, true);
            dispatchMouseEvent(element, 'mouseup', true, true);
        } else {
            // treat message as key being pressed and deal with this
            var keyEvent = window.crossBrowser_initKeyboardEvent("keypress", {"key": getCode(event.data), "char": event.data, shiftKey: false})
            document.dispatchEvent(keyEvent);
        }
    }
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

function sendGameStats() {
    if(connected) {
        // send stats from update function
        // ws.send(data)
    }
}

function sendEndGameStats(score, time) {
    ws.send(score)
    ws.send(time)
}

var dispatchMouseEvent = function(target, var_args) {
    var e = document.createEvent("MouseEvents");
    // If you need clientX, clientY, etc., you can call
    // initMouseEvent instead of initEvent
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
  };

  //The below function was was written by termi and can be viewed here:
  //https://gist.github.com/termi/4654819
  //It creates cross platform key events

  void function() {//closure

    var global = this
      , _initKeyboardEvent_type = (function( e ) {
            try {
                e.initKeyboardEvent(
                    "keyup" // in DOMString typeArg
                    , false // in boolean canBubbleArg
                    , false // in boolean cancelableArg
                    , global // in views::AbstractView viewArg
                    , "+" // [test]in DOMString keyIdentifierArg | webkit event.keyIdentifier | IE9 event.key
                    , 3 // [test]in unsigned long keyLocationArg | webkit event.keyIdentifier | IE9 event.location
                    , true // [test]in boolean ctrlKeyArg | webkit event.shiftKey | old webkit event.ctrlKey | IE9 event.modifiersList
                    , false // [test]shift | alt
                    , true // [test]shift | alt
                    , false // meta
                    , false // altGraphKey
                );
                
                
                
                /*
                // Safari and IE9 throw Error here due keyCode, charCode and which is readonly
                // Uncomment this code block if you need legacy properties
                delete e.keyCode;
                _Object_defineProperty(e, {writable: true, configurable: true, value: 9})
                delete e.charCode;
                _Object_defineProperty(e, {writable: true, configurable: true, value: 9})
                delete e.which;
                _Object_defineProperty(e, {writable: true, configurable: true, value: 9})
                */
                
                return ((e["keyIdentifier"] || e["key"]) == "+" && (e["keyLocation"] || e["location"]) == 3) && (
                    e.ctrlKey ?
                        e.altKey ? // webkit
                            1
                            :
                            3
                        :
                        e.shiftKey ?
                            2 // webkit
                            :
                            4 // IE9
                    ) || 9 // FireFox|w3c
                    ;
            }
            catch ( __e__ ) { _initKeyboardEvent_type = 0 }
        })( document.createEvent( "KeyboardEvent" ) )
    
        , _keyboardEvent_properties_dictionary = {
            "char": "",
            "key": "",
            "location": 0,
            "ctrlKey": false,
            "shiftKey": false,
            "altKey": false,
            "metaKey": false,
            "repeat": false,
            "locale": "",
    
            "detail": 0,
            "bubbles": false,
            "cancelable": false,
            
            //legacy properties
            "keyCode": 0,
            "charCode": 0,
            "which": 0
        }
    
        , own = Function.prototype.call.bind(Object.prototype.hasOwnProperty)
    
        , _Object_defineProperty = Object.defineProperty || function(obj, prop, val) {
            if( "value" in val ) {
                obj[prop] = val["value"];
            }
        }
    ;
    
    function crossBrowser_initKeyboardEvent(type, dict) {
        var e;
        if( _initKeyboardEvent_type ) {
            e = document.createEvent( "KeyboardEvent" );
        }
        else {
            e = document.createEvent( "Event" );
        }
        var _prop_name
            , localDict = {};
    
        for( _prop_name in _keyboardEvent_properties_dictionary ) if(own(_keyboardEvent_properties_dictionary, _prop_name) ) {
            localDict[_prop_name] = (own(dict, _prop_name) && dict || _keyboardEvent_properties_dictionary)[_prop_name];
        }
    
        var _ctrlKey = localDict["ctrlKey"]
            , _shiftKey = localDict["shiftKey"]
            , _altKey = localDict["altKey"]
            , _metaKey = localDict["metaKey"]
            , _altGraphKey = localDict["altGraphKey"]
    
            , _modifiersListArg = _initKeyboardEvent_type > 3 ? (
                (_ctrlKey ? "Control" : "")
                    + (_shiftKey ? " Shift" : "")
                    + (_altKey ? " Alt" : "")
                    + (_metaKey ? " Meta" : "")
                    + (_altGraphKey ? " AltGraph" : "")
                ).trim() : null
    
            , _key = localDict["key"] + ""
            , _char = localDict["char"] + ""
            , _location = localDict["location"]
            , _keyCode = localDict["keyCode"] || (localDict["keyCode"] = _key && _key.charCodeAt( 0 ) || 0)
            , _charCode = localDict["charCode"] || (localDict["charCode"] = _char && _char.charCodeAt( 0 ) || 0)
    
            , _bubbles = localDict["bubbles"]
            , _cancelable = localDict["cancelable"]
    
            , _repeat = localDict["repeat"]
            , _locale = localDict["locale"]
            , _view = global
        ;
        
        localDict["which"] || (localDict["which"] = localDict["keyCode"]);
    
        if( "initKeyEvent" in e ) {//FF
            //https://developer.mozilla.org/en/DOM/event.initKeyEvent
            e.initKeyEvent( type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode );
        }
        else if(  _initKeyboardEvent_type && "initKeyboardEvent" in e ) {//https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
            if( _initKeyboardEvent_type == 1 ) { // webkit
                //http://stackoverflow.com/a/8490774/1437207
                //https://bugs.webkit.org/show_bug.cgi?id=13368
                e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _shiftKey, _altKey, _metaKey, _altGraphKey );
            }
            else if( _initKeyboardEvent_type == 2 ) { // old webkit
                //http://code.google.com/p/chromium/issues/detail?id=52408
                e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode );
            }
            else if( _initKeyboardEvent_type == 3 ) { // webkit
                e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _altKey, _shiftKey, _metaKey, _altGraphKey );
            }
            else if( _initKeyboardEvent_type == 4 ) { // IE9
                //http://msdn.microsoft.com/en-us/library/ie/ff975297(v=vs.85).aspx
                e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _modifiersListArg, _repeat, _locale );
            }
            else { // FireFox|w3c
                //http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent-initKeyboardEvent
                //https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
                e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _char, _key, _location, _modifiersListArg, _repeat, _locale );
            }
        }
        else {
            e.initEvent(type, _bubbles, _cancelable)
        }
    
        for( _prop_name in _keyboardEvent_properties_dictionary )if( own( _keyboardEvent_properties_dictionary, _prop_name ) ) {
            if( e[_prop_name] != localDict[_prop_name] ) {
                try {
                    delete e[_prop_name];
                    _Object_defineProperty( e, _prop_name, { writable: true, "value": localDict[_prop_name] } );
                }
                catch(e) {
                    //Some properties is read-only
                }
                
            }
        }
        
        return e;
    }
    
    //export
    global.crossBrowser_initKeyboardEvent = crossBrowser_initKeyboardEvent;
    
    }.call(this);