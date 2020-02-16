import React from "react";
import { Router, Route, Switch } from "dva/router";
import dynamic from "dva/dynamic";

function RouterConfig({ history, app }) {
  const Index = dynamic({
    app,
    models: () => [import("./models/index")],
    component: () => import("./routes/index/index")
  });
  const Play = dynamic({
    app,
    models: () => [import("./models/play")],
    component: () => import("./routes/play/play")
  });
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/play" exact component={Play} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
