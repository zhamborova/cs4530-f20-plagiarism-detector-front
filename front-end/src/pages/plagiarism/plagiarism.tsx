import React from "react";
import './plagiarism.css'
import {files, files1} from "./dummy-data";
import Directory from "../../components/directory/directory";
import Code from "../../components/code/code";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {FileItem} from "../../components/file/file.utils";


/**
 * @class Plagiarism
 * The main component displaying Code and Directories
 * @description Maintains the current similarity the user is looking at
 * and enables inspection of the next/previous similarity with next/prev buttons
 */
class Plagiarism extends React.Component {
    state = {
        file1: {similarities: [], contents: {}},
        file2: {similarities: [], contents: {}},
        current: 0,
        list: ["1", "2", "4"]
    }

    setFile1 = (file1: FileItem) => {

        this.setState({file1})
    }
    setFile2 = (file2: FileItem) => {
        this.setState({file2})
    }


    /**
     * Goes either to next or previous similarity if there are any left
     * @param dir
     */
    nextSimilarity = (dir: number) => {
        if (dir > 0 && this.state.current < this.state.list.length - 1) {
                this.setState({current: this.state.current + 1},)
        }
        else if (this.state.current > 0) {
                this.setState({current: this.state.current - 1},)

        }
    }

    render() {
        let {file1, file2} = this.state;
        let cur = this.state.list[this.state.current];
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
                    <Directory data={files}
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
                    <Directory data={files1}
                               setFile={this.setFile2}
                               curSimilarityId={cur}/>
                </div>

            </div>
        </div>

    }
}


export default Plagiarism;
