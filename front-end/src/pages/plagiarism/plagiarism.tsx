import React from "react";
import './plagiarism.css'
import Directory from "../../components/directory/directory";
import Code from "../../components/code/code";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {FileItem} from "../../components/file/file.utils";
import {FolderItem} from "../../components/folder/folder.utils";
import {Spinner} from "react-bootstrap";

interface PlagiarismState {
    project1:(FolderItem|FileItem)[],
    project2:(FolderItem|FileItem)[],
    idList: string[],
    file1: FileItem,
    file2: FileItem,
    current: number,
}


/**
 * @class Plagiarism
 * The main component displaying Code and Directories
 * @description Maintains the current similarity the user is looking at
 * and enables inspection of the next/previous similarity with next/prev buttons
 */
class Plagiarism extends React.Component<{},PlagiarismState> {
    state = {
        file1: { type: "file", name: "", contents: {}, similarities: [] },
        file2: { type: "file", name: "", contents: {}, similarities: [] },
        current: 0,
        idList: ["3329f8043027b56d690b301da16adcbb96eb0d8d",
            "17672af67552cefc7ed523310456d512c9f56a9f"],
        project1:[],
        project2:[],

    }

   componentDidMount(): void {
       fetch("http://localhost:8080/plagiarism")
           .then(res => res.json())
           .then(results => {
               console.log(results)
               const {files1, files2, } = results
               this.setState({project1:files1, project2:files2})
           })
   }



    setFile1 = (file1: FileItem) => {

        this.setState({file1})
    }
    setFile2 = (file2: FileItem) => {
        this.setState({file2})
    }


    /**
     * Goes either to next or previous similarity if there are any left
     * @param dir determines whether go to the next or previous similarity
     */
    nextSimilarity = (dir: number) => {
        if (dir > 0 && this.state.current < this.state.idList.length - 1) {
                this.setState({current: this.state.current + 1},)
        }
        else if (dir < 0 && this.state.current > 0) {
                this.setState({current: this.state.current - 1},)

        }
    }

    render() {
        let {file1, file2} = this.state;
        let cur = this.state.idList[this.state.current];
        return <div className="plagiarism-container mt-5 mb-5">
            <h2 className="mr-auto ml-auto text-center mb-4">Report</h2>
            <div className="next-similarity d-flex ">
                <h4 className="score">Similarity Score: 87%</h4>
                <button className="form-control btn-down ml-auto"
                        onClick={() => this.nextSimilarity(1)}>
                    Next similarity <FontAwesomeIcon icon={faArrowDown}/></button>
                <button className="form-control btn-up " onClick={() => this.nextSimilarity(-1)}>
                    Prev similarity <FontAwesomeIcon icon={faArrowUp}/></button>
            </div>
            <div className="row code-container d-flex flex-nowrap m-0 mt-3 ">
                <div className="folder-structure col-2">
                    <Directory data={this.state.project1}
                               setFile={this.setFile1}
                               curSimilarityId={cur}/>
                </div>
                <div className="col-4 code-block">
                    <Code {...file1} curSimilarityId={cur}/>
                </div>
                <div className="col-4 code-block">

                    <Code {...file2} curSimilarityId={cur}/>
                </div>
                <div className="folder-structure col-2">
                    <Directory data={this.state.project2}
                               setFile={this.setFile2}
                               curSimilarityId={cur}/>
                </div>

            </div>
        </div>

        // <div className="container-fluid d-flex">
        //
        //     <Spinner animation="border"  role="status">
        //         <span className="sr-only">Loading...</span>
        //     </Spinner>
        // </div>

    }
}


export default Plagiarism;
