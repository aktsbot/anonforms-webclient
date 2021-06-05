import { BrowserRouter, Switch, Route } from "react-router-dom";

// all components
import Auth from "./components/Auth";
import ViewForm from "./components/ViewForm";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth" exact component={Auth} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/:form_uri" exact component={ViewForm} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
