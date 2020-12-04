import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

interface FileUploadProps {
    setFile: (name: string, file: Blob|string)=>void,
    fileName:string,
    uploaded: boolean

}

/**
 * @function FileUpload
 * @description Responsible for a single file upload
 * @param props
 */
const FileUpload = (props:FileUploadProps)=> {

   const { setFile, fileName, uploaded} = props

    return  !uploaded ? <div className="d-flex mb-3 upload-item">
            <div className="input-group">
                <div className="custom-file">
        <input className="custom-file-input"
           type="file"
           id="file"
           accept=".zip"
           onChange={event => setFile(fileName,event.target.files![0])}/>
          <label className="custom-file-label" >Choose project {fileName}</label>
           </div>
        </div>
      </div> :
    <div className="d-flex">
    <p className="upload-success-txt mr-auto"> Project {fileName} is uploaded </p>
    <FontAwesomeIcon className="remove-file-icon" icon={faTimes}
      onClick={()=> setFile(fileName, "")}/>
    </div>


}

export default FileUpload;
