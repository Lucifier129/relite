import { createStore } from "../index";
import createLogger from "../logger";

import * as actions from "./src/actions.helper";

describe("test-createLogger", () => {
  it("message should been consoled", () => {
    const store = createStore(actions, { count: 0 })
    const logger = createLogger()
    store.subscribe(logger)

    store.actions.INCREMENT()
  });
});
