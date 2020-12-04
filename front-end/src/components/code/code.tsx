import React from "react";
import './code.css'
import {Similarity} from "../file/file.utils";

interface CodeProps {
    contents: { [key: string]: string},
    curSimilarityId:string,
    similarities: (Similarity)[]
}
interface CodeState {
    contents: { [key: string]: string},
    map: { [key: string]: HTMLElement},

}

/**
 * @class Code
 * This class is responsible for displaying code on Plagiarism page
 * @description It highlights plagiarized code and keeps track of the current similarity
 * the user is a looking at
 */
class Code extends React.Component<CodeProps,CodeState>{
    private domRefs: any = {}



    componentDidMount() {
        let {curSimilarityId} = this.props
        if(curSimilarityId){
                if(this.domRefs[curSimilarityId]) {

                    this.domRefs[curSimilarityId].scrollIntoView({behavior:"smooth"})
                }
        }
    }


    componentDidUpdate(prevProps:CodeProps, prevState:CodeState, snapshot:any) {
        let {curSimilarityId, contents} = this.props

        if(prevProps.curSimilarityId !== curSimilarityId){


                if(this.domRefs[curSimilarityId]) {
                    this.domRefs[curSimilarityId].scrollIntoView({behavior:"smooth"})
                }

        }


    }



//highlight plagiarized code
    highlight = (i:number) =>{
        let col = ""
        this.props.similarities.forEach(s => {
            if(s.id === this.props.curSimilarityId && s.startLine <= i && i <= s.endLine){
                col = "red-current"
            }
            else if(s.startLine <= i && i <= s.endLine) {
                col = "red";
            }
            else return ""
        })

        return col;
    }

    //map ref to similarity id
    setRef = (i:number, elem:any) =>{
        this.props.similarities.forEach(s => {
            if(i === s.startLine) {
              this.domRefs[`${s.id}`] = elem
            }

       })

    }


    render() {

        return <div className="file-container">
            {Object.keys(this.props.contents).map((key, i) => (

                <code key={i} className={this.highlight(i)}
                      ref={elem =>this.setRef(i, elem)}>
                    <span className="index" >{i}</span>
                    {this.props.contents[key]}
                 </code>))
            }
        </div>
    }
}


export default Code;
