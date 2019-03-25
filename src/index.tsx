import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "src/ts/components/App";

import registerServiceWorker from "src/registerServiceWorker";

ReactDOM.render(
  <App />,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
