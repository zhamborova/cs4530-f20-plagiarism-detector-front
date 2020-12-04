import React from "react";
import {FileProps, FileState} from "./file.utils";
const color = "rgb(235, 233, 233)";


/**
 * @class File
 * Represents a file in a directory
 * @description If the file contains the current similarity the user is looking at
 * It will send the contents of this file to Code class through parent(Plagiarism)
 */
class File extends React.Component<FileProps, FileState>{
    constructor(props:FileProps) {
        super(props);
        this.state={
            highlight: "transparent"
        }
    }

    componentDidMount() {
        this.highlightFile()
    }
    componentDidUpdate(prevProps:FileProps, prevState:FileState,snapshot:any) {
        let { curSimilarityId} = this.props
        prevProps.curSimilarityId !== curSimilarityId ?  this.highlightFile() :
                                         this.setState({highlight:"transparent"})
        }

    /**
     * set color of the file in dir if it contains the current similarity
     */
       highlightFile(this: File) {
         let {item, setFile, curSimilarityId} = this.props
         if(item.similarities.some(s => s.id === curSimilarityId)){
             setFile(item)
             this.setState({highlight:color})
         }
     }

    render(){
        let {item, setFile} = this.props
        return <span className={`d-block`}
                     style={{backgroundColor: this.state.highlight}}
                     onClick={()=> setFile(item)}>
                        {item.name}</span>
    }
}

export default File;
