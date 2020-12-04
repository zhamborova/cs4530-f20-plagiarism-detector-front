import React from "react"
import {FolderItem} from '../folder/folder.utils'
import {FileItem, instanceOfFileItem} from "../file/file.utils";
import File from '../file/file'
import Folder from "../folder/folder"

export interface DirectoryProps{
    curSimilarityId:string,
    data:(FolderItem|FileItem)[]
    setFile:  (file:FileItem)=>void,
}


/**
 * @class Directory
 * This class is responsible for all Files/Folders display and logic
 */
class Directory extends React.Component<DirectoryProps>{

    shouldComponentUpdate(nextProps: Readonly<DirectoryProps>,
                          nextState: any, nextContext: any): boolean {
        return nextProps.curSimilarityId !== this.props.curSimilarityId
    }

    render(){
        return this.props.data.map(item => {
            if (instanceOfFileItem(item)) {
                return <File key={item.name} item={item}
                             setFile={this.props.setFile}
                             current={this.props.curSimilarityId}/>
            }
            else {
                return (
                    <Folder name={item.name} key={item.name} current={this.props.curSimilarityId} >
                        <Directory data={item.children}
                                   setFile={this.props.setFile}
                                   curSimilarityId={this.props.curSimilarityId}/>
                    </Folder>
                );
            }
        });}
};

export  default  Directory;


