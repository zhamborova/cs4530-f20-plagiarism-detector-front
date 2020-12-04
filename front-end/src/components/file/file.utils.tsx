
export interface FileItem  {
    type: string,
    name: string,
    contents: Object,
    similarities: Array<Similarity>
};

export interface FileProps {
    item: FileItem,
    setFile: (file:FileItem)=>void,
    curSimilarityId: string
}
export interface FileState {
    highlight:string

}
export interface Similarity {
    id: string,
    startLine: number,
    endLine: number
}

export function instanceOfFileItem(object: any): object is FileItem {
    return  object.hasOwnProperty("type") && object.type=="file"
}



