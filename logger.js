"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var attr = typeof console !== "undefined" && "info" in console ? "info" : "log";
var pad = function (num) { return ("0" + num).slice(-2); };
var identity = function (obj) { return obj; };
var defaultOptions = {
    name: "ROOT",
    filter: identity
};
function createLogger(customeOptions) {
    var _a = __assign(__assign({}, defaultOptions), customeOptions), name = _a.name, filter = _a.filter;
    filter = typeof filter === "function" ? filter : identity;
    var logInfo = function (data) {
        data = filter(data);
        var actionType = data.actionType, actionPayload = data.actionPayload, previousState = data.previousState, currentState = data.currentState, _a = data.start, start = _a === void 0 ? new Date() : _a, _b = data.end, end = _b === void 0 ? new Date() : _b;
        var formattedTime = start.getHours() + ":" + pad(start.getMinutes()) + ":" + pad(start.getSeconds());
        var takeTime = end.getTime() - start.getTime();
        var message = name + ":\u00A0action-type\u00A0[" + actionType + "]\u00A0@\u00A0" + formattedTime + "\u00A0in\u00A0" + takeTime + "ms";
        try {
            console.groupCollapsed(message);
        }
        catch (e) {
            try {
                console.group(message);
            }
            catch (e) {
                console.log(message);
            }
        }
        if (attr === "log") {
            console[attr](actionPayload);
            console[attr](previousState);
            console[attr](currentState);
        }
        else {
            console[attr]("%c\u00A0action-payload", "color:\u00A0#03A9F4;\u00A0font-weight:\u00A0bold", actionPayload);
            console[attr]("%c\u00A0prev-state", "color:\u00A0#9E9E9E;\u00A0font-weight:\u00A0bold", previousState);
            console[attr]("%c\u00A0next-state", "color:\u00A0#4CAF50;\u00A0font-weight:\u00A0bold", currentState);
        }
        try {
            console.groupEnd();
        }
        catch (e) {
            console.log("-- log end --");
        }
    };
    return logInfo;
}
exports.default = createLogger;
