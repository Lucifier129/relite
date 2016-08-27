'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createLogger;
var attr = 'info' in console ? 'info' : "log";
var pad = function pad(num) {
    return ('0' + num).slice(-2);
};

function createLogger(_ref) {
    var _ref$name = _ref.name;
    var name = _ref$name === undefined ? "ROOT" : _ref$name;

    var logInfo = function logInfo(data) {
        var actionType = data.actionType;
        var actionPayload = data.actionPayload;
        var previousState = data.previousState;
        var currentState = data.currentState;
        var _data$start = data.start;
        var start = _data$start === undefined ? new Date() : _data$start;
        var _data$end = data.end;
        var end = _data$end === undefined ? new Date() : _data$end;

        var formattedTime = start.getHours() + ':' + pad(start.getMinutes()) + ':' + pad(start.getSeconds());
        var takeTime = end.getTime() - start.getTime();
        var message = name + ': action-type [' + actionType + '] @ ' + formattedTime + ' in ' + takeTime + 'ms';

        try {
            console.groupCollapsed(message);
        } catch (e) {
            try {
                console.group(message);
            } catch (e) {
                console.log(message);
            }
        }

        if (attr === 'log') {
            console[attr](actionPayload);
            console[attr](previousState);
            console[attr](currentState);
        } else {
            console[attr]('%c action-payload', 'color: #03A9F4; font-weight: bold', actionPayload);
            console[attr]('%c prev-state', 'color: #9E9E9E; font-weight: bold', previousState);
            console[attr]('%c next-state', 'color: #4CAF50; font-weight: bold', currentState);
        }

        try {
            console.groupEnd();
        } catch (e) {
            console.log('-- log end --');
        }
    };

    return logInfo;
}