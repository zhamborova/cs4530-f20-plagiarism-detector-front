import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Plagiarism from "./pages/plagiarism/plagiarism";
import {BrowserRouter, Switch, Route, RouteComponentProps, Link} from 'react-router-dom'
import Upload from "./pages/upload/upload";
import {Spinner} from "react-bootstrap";

interface AppState {
    uploaded: boolean,
}




class App extends React.Component<{}, AppState>{


  state =  {
    uploaded: false,
  }

 setUpload = () =>{
      this.setState({uploaded:true})
 }

  render(){
  return <BrowserRouter>
    <Switch>
      <Route exact path={"/"} component={(props:RouteComponentProps)=>
                                            <Upload setUpload={this.setUpload}
                                            history={props.history} />}/>

        { this.state.uploaded ?
            <Route exact path={"/plagiarism"}  component={Plagiarism}/> :
            <Link to="/" className="">Please upload the projects first</Link>
        }
    </Switch>
  </BrowserRouter>

  }
}
export default App;
