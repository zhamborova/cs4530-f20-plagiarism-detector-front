import React from "react";
import {FileItem} from "../file/file.utils";
import Directory from "../directory/directory";

export interface FolderProps {
    name:string,
    curSimilarityId:string,
    children: React.ReactElement<Directory>
}

export interface FolderState {
    isOpen:boolean
}
export interface FolderItem {
    type: string,
    name: string,
    children: (FolderItem| FileItem)[]
}
