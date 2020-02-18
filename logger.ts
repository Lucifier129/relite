const attr =
  typeof console !== "undefined" && "info" in console ? "info" : "log";
const pad = (num: number) => ("0" + num).slice(-2);
const identity = (obj: DraftData) => obj;

export type LoggerOptions = {
  name?: string;
  filter?: Filter;
};

export type Filter = (data: DraftData) => DraftData;

export interface DraftData {
  actionType: string;
  actionPayload: any;
  previousState: object;
  currentState: object;
  start: Date;
  end: Date;
}

const defaultOptions: Required<LoggerOptions> = {
  name: "ROOT",
  filter: identity
}

export default function createLogger(customeOptions?: LoggerOptions) {
  let { name, filter } = { ...defaultOptions, ...customeOptions }
  filter = typeof filter === "function" ? filter : identity;
  const logInfo = (data: DraftData) => {
    data = filter(data);
    const {
      actionType,
      actionPayload,
      previousState,
      currentState,
      start = new Date(),
      end = new Date()
    } = data;
    const formattedTime = `${start.getHours()}:${pad(start.getMinutes())}:${pad(
      start.getSeconds()
    )}`;
    const takeTime = end.getTime() - start.getTime();
    const message = `${name}: action-type [${actionType}] @ ${formattedTime} in ${takeTime}ms`;

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
        `%c action-payload`,
        `color: #03A9F4; font-weight: bold`,
        actionPayload
      );
      console[attr](
        `%c prev-state`,
        `color: #9E9E9E; font-weight: bold`,
        previousState
      );
      console[attr](
        `%c next-state`,
        `color: #4CAF50; font-weight: bold`,
        currentState
      );
    }

    try {
      console.groupEnd();
    } catch (e) {
      console.log("-- log end --");
    }
  };

  return logInfo;
}
