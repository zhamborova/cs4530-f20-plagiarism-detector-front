import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Plagiarism from "./pages/plagiarism/plagiarism";
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Upload from "./pages/upload/upload";
import {FolderItem} from "./components/folder/folder.utils";
import {FileItem} from "./components/file/file.utils";

interface AppState {
  project1:(FolderItem|FileItem)[],
  project2:(FolderItem|FileItem)[]
}

interface AppProps {

}

class App extends React.Component<AppProps, AppState>{


  state =  {
    project1: [],
    project2: []
  }
  componentDidMount(): void {
    fetch("http://localhost:8080/plagiarism")
        .then(res => res.json())
        .then(results => {
            console.log(results.default)
          const {files1, files2} = results.default
           this.setState({project1:files1, project2:files2},)

        })
  }


  render(){
  return <BrowserRouter>
    <Switch>
      <Route exact path={"/"} component={Upload}/>
      <Route exact path={"/plagiarism"}

             component={() => <Plagiarism project1={this.state.project1}
                                          project2={this.state.project2}
                                          idList={["3329f8043027b56d690b301da16adcbb96eb0d8d",
                                           "17672af67552cefc7ed523310456d512c9f56a9f",
                                          "1b540f4a9c95dc68908dc478df7d0450ba29e771"]}/>}/>
    </Switch>
  </BrowserRouter>

  }
}
export default App;
