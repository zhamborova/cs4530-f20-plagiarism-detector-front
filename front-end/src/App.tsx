import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Plagiarism from "./pages/plagiarism/plagiarism";
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Upload from "./pages/upload/upload";
function App() {

  return <BrowserRouter>
    <Switch>
      <Route exact path={"/"} component={Upload}/>
      <Route exact path={"/plagiarism"} component={Plagiarism}/>
    </Switch>
  </BrowserRouter>


}
export default App;
