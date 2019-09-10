/**
 * createLogger
 */
import { Pad, Filter, LoggerCreator, LogInfo, Actions } from "./index";

const createLogger: LoggerCreator = <S extends object, AS extends Actions<S>>({
  name = undefined,
  filter = undefined
} = {}) => {
  const pad: Pad = num => ("0" + num).slice(-2);
  const identity: Filter<S, AS> = obj => obj;
  filter = typeof filter === "function" ? filter : identity;

  let logInfo: LogInfo<S, AS> = data => {
    const attr: string =
      typeof console !== "undefined" && typeof console.info !== "undefined"
        ? "info"
        : "log";
    data = filter(data);
    const {
      actionType,
      actionPayload,
      previousState,
      currentState,
      start,
      end
    } = data;
    const formattedTime: string = `${start.getHours()}:${pad(
      start.getMinutes()
    )}:${pad(start.getSeconds())}`;
    const takeTime: number = end.getTime() - start.getTime();
    const message: string = `${name ||
      "ROOT"}: action-type [${actionType}] @ ${formattedTime} in ${takeTime}ms}`;

    try {
      console.groupCollapsed(message);
    } catch (e) {
      try {
        console.group(message);
      } catch (e) {
        console.log(message);
      }
    }

    if (attr === "log") {
      console[attr](actionPayload);
      console[attr](previousState);
      console[attr](currentState);
    } else {
      console[attr](
        `%c action-payload`,
        `color: #03A9F4; font-weight: bold`,
        actionPayload
      );
      console[attr](
        `%c prev-state`,
        `color: #9E9E9E; font-weight: bold`,
        previousState
      );
      console[attr](
        `%c next-state`,
        `color: #4CAF50; font-weight: bold`,
        currentState
      );
    }

    try {
      console.groupEnd();
    } catch (e) {
      console.log("-- log end --");
    }
  };

  return logInfo;
};

export default createLogger;
