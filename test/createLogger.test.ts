import { createStore, createLogger, Action, Actions } from "../src/index";
import * as actions from "./src/actions.helper";

describe("test-createLogger", () => {
  it("filter will should been called", () => {
    let store = createStore(actions, { count: 0 });
    let logInfo = createLogger({
      name: "test",
      filter: data => {
        expect(data.actionType).toBe("INCREMENT");
        return data;
      }
    });

    jest.spyOn(global.console, "warn");
    jest.spyOn(global.console, "info");
    jest.spyOn(global.console, "log");

    store.subscribe(logInfo);
    store.actions.INCREMENT();

    store.actions.INCREMENT();

    expect(console.info).toBeCalled();
  });

  it("console should been called correctly", () => {
    let store = createStore(actions, { count: 0 });
    let logInfo = createLogger();

    jest.spyOn(global.console, "info");

    store.subscribe(logInfo);
    store.actions.INCREMENT();

    store.actions.INCREMENT();

    expect(console.info).toBeCalled();
  });

  it("console.log should been called when console.group is unvaliable", () => {
    let store = createStore(actions, { count: 0 });
    let logInfo = createLogger();

    global.console.groupCollapsed = () => {
      throw new Error("test");
    };

    jest.spyOn(global.console, "log");
    jest.spyOn(global.console, "group");
    jest.spyOn(global.console, "groupEnd");

    store.subscribe(logInfo);
    store.actions.INCREMENT();

    expect(console.group).toBeCalledTimes(1);
    expect(console.groupEnd).toBeCalledTimes(1);

    global.console.group = () => {
      throw new Error("test");
    };

    store.actions.INCREMENT();

    expect(console.log).toBeCalledTimes(1);

    global.console.groupEnd = () => {
      throw new Error("test");
    };

    store.actions.INCREMENT();

    expect(console.log).toBeCalledTimes(3);
  });

  it("console.log should been called when console.info is unvaliable", () => {
    let store = createStore(actions, { count: 0 });
    let logInfo = createLogger();

    console.info = undefined as typeof console.log;

    jest.spyOn(global.console, "log");

    store.subscribe(logInfo);
    store.actions.INCREMENT();

    expect(console.log).toBeCalledTimes(5);
  });
});
