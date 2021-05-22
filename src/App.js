import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./min.css";

// all components
import Auth from "./components/Auth";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
