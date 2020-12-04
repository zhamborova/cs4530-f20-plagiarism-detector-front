import * as React from "react"
import Axios from "axios";
import "./upload.css"
import FileUpload from "../../components/file-upload/file-upload";

interface CodeState {
    file1: Blob | string
    file2: Blob | string
    loading: boolean
}



class Upload extends React.Component<CodeState>{
    state={
        file1: "",
        file2: "",
        loading: false,
    }


    /**
     * Uploads two files on the server separately
     */
    send = () => {

        if(!this.state.file1 || !this.state.file2){
            alert("Please upload the missing projects!")
        }
        else{
            const data = new FormData();
            const data2 = new FormData();
            data.append("file", this.state.file1);
            data2.append("file", this.state.file2);

            Axios.post("http://localhost:8080/upload/project1", data)
                .then(res => console.log(res))
                .catch(err => console.log(err));
            Axios.post("http://localhost:8080/upload/project2", data)
                .then(res => console.log(res))
                .catch(err => console.log(err));


            //    fetch("http://localhost:8080/upload/project1",
            //        {
            //            method: "POST",
            //            body: JSON.stringify(data)
            //        }).then(res => console.log(res))
            //        .catch(err => console.log(err));
        }
    }

    /**
     * Set file function to be passed to FileUpload component
     * @param fileNum
     * @param file
     */
    setFile = (fileNum:string, file:Blob|string) => {
        this.setState({["file"+fileNum]: file})
    }

    render() {
        let canSend = this.state.file2 && this.state.file1

        return ( <div className="container upload-container w-50 ">
                <h3 className="mr-auto ml-auto">Upload two projects/files in
                    <span className="font-weight-bolder"> zip</span> format</h3>
                <form action="#" className="mt-3">
                    <FileUpload setFile={this.setFile} uploaded={this.state.file1 !== ""} fileName="1"/>
                    <FileUpload setFile={this.setFile} uploaded={this.state.file2 !== ""} fileName="2" />
                </form>
                <button className={`btn btn-dark btn-send ${canSend? `` : 'disabled'}`}
                        onClick={()=>this.send()}>Compare programs</button>
            </div>
        );
    }
}

export default Upload;
